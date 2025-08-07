import OpenAI from 'openai'
import { BaseAgent } from './shared/agent-base'
import { GenerationInput, BrandContext, ContentGenerationOutput, SharedContext } from './shared/interfaces'
import { getSuggestedIconsForIndustry, AVAILABLE_ICONS } from '@/lib/icons/icon-categories'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ContentGenerationInput {
  input: GenerationInput
  brandContext: BrandContext
}

export class ContentGenerationAgent extends BaseAgent<ContentGenerationInput, ContentGenerationOutput> {
  name = 'content-generation'

  async process(input: ContentGenerationInput, context: SharedContext): Promise<ContentGenerationOutput> {
    const language = this.detectLanguage(
      `${input.input.businessName} ${input.input.description} ${input.input.services.join(' ')}`
    )
    
    // Generate all sections using comprehensive prompt
    const content = await this.generateAllContent(input, language)
    
    return {
      ...content,
      executionTime: 0 // Will be set by base class
    }
  }

  validate(output: ContentGenerationOutput): boolean {
    try {
      return !!(
        output.hero?.title &&
        output.hero?.subtitle &&
        output.hero?.cta_text &&
        output.about?.title &&
        output.about?.description &&
        output.services?.title &&
        output.services?.items?.length > 0 &&
        output.contact?.title
      )
    } catch {
      return false
    }
  }

  getRequiredInputs(): string[] {
    return ['input', 'brandContext']
  }

  private async generateAllContent(
    input: ContentGenerationInput, 
    language: string
  ): Promise<ContentGenerationOutput> {
    const prompt = this.buildComprehensivePrompt(input, language)

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional copywriter specializing in small business websites.

CRITICAL: You must write ALL content in the same language as the user's input. If they provide Swedish input, write in Swedish. If they provide English input, write in English. Never translate or change the language.

Return ONLY a JSON object with this exact structure. EVERY service item MUST include an "icon" field:
{
  "hero": {
    "title": "EXACT business name - no slogans or catchphrases",
    "subtitle": "compelling supporting description with value proposition", 
    "cta_text": "strong action button text"
  },
  "about": {
    "title": "about section title",
    "description": "engaging about description"
  },
  "services": {
    "title": "services section title",
    "items": [
      {
        "name": "service name",
        "description": "service description",
        "price": "price string or null if no price",
        "icon": "REQUIRED: Exact IconName from the available icons list below"
      }
    ]
  },
  "contact": {
    "title": "contact section title",
    "email": "provided email or null",
    "phone": "provided phone or null", 
    "address": "provided address or null"
  }
}

CRITICAL: Every single service item MUST have an "icon" field with a valid icon name from the available icons.

Write content that:
- Matches the brand personality and tone exactly, never guess.
- Appeals to the specific target audience
- Uses compelling, benefit-focused language
- Includes clear calls-to-action
- Feels authentic and professional
- Incorporates the unique value propositions
- Follows the messaging framework guidelines`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 4000,
      temperature: 0.8
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated from content generation agent')
    }

    try {
      const cleanedContent = this.extractJSON(content)
      const result = JSON.parse(cleanedContent)
      
      // Add provided contact info (override AI generated placeholders)
      result.contact.email = input.input.contactEmail || null
      result.contact.phone = input.input.contactPhone || null
      result.contact.address = input.input.contactAddress || null
      
      // Add icons to services if AI didn't include them (fallback logic)
      result.services.items = result.services.items.map((service: any, index: number) => {
        if (!service.icon) {
          const suggestedIcons = getSuggestedIconsForIndustry(input.input.industry)
          service.icon = suggestedIcons[index % suggestedIcons.length] || 'Star'
        }
        return service
      })
      
      // Log service items with icons for debugging
      console.log('[DEBUG] Generated services with icons:', JSON.stringify(result.services.items, null, 2))
      
      return result
    } catch (error) {
      console.error('Failed to parse content generation response:', content)
      throw new Error('Invalid content generation response')
    }
  }

  private buildComprehensivePrompt(input: ContentGenerationInput, language: string): string {
    const { input: businessInput, brandContext } = input
    const suggestedIcons = getSuggestedIconsForIndustry(businessInput.industry)
    const allAvailableIcons = Object.keys(AVAILABLE_ICONS)
    
    return `Create complete website content for this business using the brand guidelines:

BUSINESS INFORMATION:
- Name: ${businessInput.businessName}
- Industry: ${businessInput.industry}
- Description: ${businessInput.description}
- Services: ${businessInput.services.join(', ')}
- Location: ${businessInput.contactAddress || 'Not specified'}

BRAND GUIDELINES (FOLLOW EXACTLY):
- Brand Personality: ${brandContext.personality.join(', ')}
- Tone: ${brandContext.tone.description}
- Target Audience: ${brandContext.targetAudience}
- Unique Value Props: ${brandContext.uniqueValueProps.join(', ')}

MESSAGING FRAMEWORK:
- Primary Message: ${brandContext.messagingFramework.primaryMessage}
- Supporting Messages: ${brandContext.messagingFramework.supportingMessages.join(', ')}
- Avoid These: ${brandContext.messagingFramework.avoidanceList.join(', ')}

COMPETITIVE DIFFERENTIATORS:
${brandContext.competitorDifferentiators.join(', ')}

AVAILABLE ICONS FOR SERVICES:
Choose appropriate icons from these options. Use the exact name as shown:

SUGGESTED FOR ${businessInput.industry.toUpperCase()} INDUSTRY:
${suggestedIcons.join(', ')}

ALL AVAILABLE ICONS:
${allAvailableIcons.join(', ')}

CONTENT REQUIREMENTS:

**Hero Section**: 
- TITLE: Use the exact business name "${businessInput.businessName}" as the main headline - do not create a slogan or catchphrase
- SUBTITLE: Create a compelling description that incorporates their primary message and unique value proposition  
- CTA: Include a strong call-to-action that matches their tone

**About Section**:
- Tell their story in a way that builds trust and connection
- Incorporate their personality traits naturally
- Highlight what makes them different from competitors
- Appeal directly to their target audience

**Services Section**:
- Present each service with benefits, not just features
- Use language that matches their brand tone
- Focus on value delivery to their specific audience
- Include compelling descriptions that drive action
- MANDATORY: Choose a relevant icon for EACH service from the available icons above. Do NOT skip this step!

**Contact Section**:
- Create a welcoming but professional title
- Match the overall brand tone
- Make it easy and inviting to get in touch

IMPORTANT: Write ALL content in ${language}. Use the exact tone and personality specified in the brand guidelines. Make sure every word aligns with their messaging framework and appeals to their target audience. For service icons, use EXACT icon names from the available list.`
  }

  private extractJSON(content: string): string {
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch) {
      return jsonMatch[1].trim()
    }
    
    const directJsonMatch = content.match(/\{[\s\S]*\}/)
    if (directJsonMatch) {
      return directJsonMatch[0].trim()
    }
    
    return content.trim()
  }
}