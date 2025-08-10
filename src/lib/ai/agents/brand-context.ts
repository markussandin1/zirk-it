import OpenAI from 'openai'
import { BaseAgent } from './shared/agent-base'
import { GenerationInput, BrandContext, SharedContext } from './shared/interfaces'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class BrandContextAgent extends BaseAgent<GenerationInput, BrandContext> {
  name = 'brand-context'

  async process(input: GenerationInput, context: SharedContext): Promise<BrandContext> {
    const language = this.detectLanguage(`${input.businessName} ${input.description} ${input.services.join(' ')}`)
    const prompt = this.buildPrompt(input, language)

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a brand intelligence expert specializing in small business positioning and messaging.

CRITICAL: You must provide ALL text content in the same language as the user's input. If they provide Swedish input, respond with Swedish text. If they provide English input, respond with English text. Never translate or change the language.

Return ONLY a JSON object with this exact structure:
{
  "personality": ["trait1", "trait2", "trait3"],
  "tone": {
    "primary": "professional|friendly|authoritative|warm|innovative",
    "modifiers": ["modifier1", "modifier2"],
    "description": "detailed tone description"
  },
  "targetAudience": "description of target audience",
  "uniqueValueProps": ["value1", "value2", "value3"],
  "messagingFramework": {
    "primaryMessage": "main brand message",
    "supportingMessages": ["supporting1", "supporting2"],
    "avoidanceList": ["avoid1", "avoid2"]
  },
  "competitorDifferentiators": ["diff1", "diff2"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "industry": "industry category"
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 2000,
      temperature: 0.7
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated from brand context agent')
    }

    try {
      const cleanedContent = this.extractJSON(content)
      const result = JSON.parse(cleanedContent)
      
      // Add metadata
      result.confidence = this.calculateConfidence(input, result)
      result.executionTime = 0 // Will be set by base class
      
      return result
    } catch (error) {
      console.error('Failed to parse brand context response:', content)
      throw new Error('Invalid brand context response')
    }
  }

  validate(output: BrandContext): boolean {
    try {
      return !!(
        output.personality?.length > 0 &&
        output.tone?.primary &&
        output.tone?.description &&
        output.targetAudience &&
        output.uniqueValueProps?.length > 0 &&
        output.messagingFramework?.primaryMessage &&
        output.keywords?.length > 0 &&
        output.industry
      )
    } catch {
      return false
    }
  }

  getRequiredInputs(): string[] {
    return ['businessName', 'industry', 'description', 'services']
  }

  private buildPrompt(input: GenerationInput, language: string): string {
    return `Analyze this business and create a brand profile in the language the user wrote their input in:

Business Name: ${input.businessName}
Industry: ${input.industry}
Description: ${input.description}
Services: ${input.services.join(', ')}
${input.contactAddress ? `Location: ${input.contactAddress}` : ''}

Create a brand profile that considers:

1. **Brand Personality**: What personality traits would appeal to their customers?
2. **Communication Tone**: What tone of voice fits their industry and audience?
3. **Target Audience**: Who are their ideal customers? Be specific about demographics and psychographics.
4. **Unique Value Propositions**: What makes them stand out from competitors?
5. **Messaging Framework**: Core messages they should communicate and what to avoid
6. **Competitive Differentiation**: How they can differentiate from similar businesses
7. **Relevant Keywords**: Industry-specific and location-based keywords for their market

Consider their industry context, local market dynamics, and customer expectations.

IMPORTANT: Write ALL responses in ${language}. The user provided their input in ${language}, so all brand profile content must be in the same language. Do not translate or change the language.`
  }

  private extractJSON(content: string): string {
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch) {
      return this.fixJSONSyntax(jsonMatch[1].trim())
    }
    
    const directJsonMatch = content.match(/\{[\s\S]*\}/)
    if (directJsonMatch) {
      return this.fixJSONSyntax(directJsonMatch[0].trim())
    }
    
    return this.fixJSONSyntax(content.trim())
  }

  private fixJSONSyntax(jsonString: string): string {
    // Fix common JSON syntax issues from AI responses
    try {
      // First try to parse as-is
      JSON.parse(jsonString)
      return jsonString
    } catch {
      // Fix missing commas between object properties
      let fixed = jsonString
      
      // Fix missing commas after closing brackets/quotes before opening quotes
      fixed = fixed.replace(/("\]|\})\s*\n\s*"/g, '$1,\n  "')
      
      // Fix missing commas after quoted values before next property
      fixed = fixed.replace(/"([^"]*)"(\s*\n\s*")/g, '"$1",$2')
      
      // Fix missing commas in arrays
      fixed = fixed.replace(/("\s*)\n(\s*")/g, '$1,\n$2')
      
      try {
        JSON.parse(fixed)
        return fixed
      } catch {
        // If still failing, try more aggressive fixes
        console.warn('JSON syntax still invalid after fixes, returning original')
        return jsonString
      }
    }
  }

  private calculateConfidence(input: GenerationInput, result: BrandContext): number {
    // Calculate confidence based on input quality and result completeness
    let confidence = 0.5 // base confidence
    
    // Increase confidence for detailed input
    if (input.description && input.description.length > 50) confidence += 0.2
    if (input.services.length > 1) confidence += 0.1
    if (input.contactAddress) confidence += 0.1
    
    // Increase confidence for complete brand context result
    if (result.personality.length >= 3) confidence += 0.1
    if (result.uniqueValueProps.length >= 2) confidence += 0.1
    if (result.keywords.length >= 3) confidence += 0.1
    
    return Math.min(confidence, 1.0)
  }
}