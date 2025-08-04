import OpenAI from 'openai'
import { promptManager } from './prompt-manager'
import { PageContent } from '@/types/database'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface GenerationInput {
  businessName: string
  industry: string
  description: string
  services: string[]
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
}

interface SectionContent {
  hero: {
    title: string
    subtitle: string
    cta_text: string
  }
  about: {
    title: string
    description: string
  }
  services: {
    title: string
    items: Array<{
      name: string
      description: string
      price?: string
    }>
  }
  contact: {
    title: string
    email?: string
    phone?: string
    address?: string
  }
}

export class ContentGenerator {
  /**
   * Generate complete website content using AI
   */
  async generateWebsiteContent(input: GenerationInput): Promise<PageContent> {
    try {
      console.log('Starting AI content generation for:', input.businessName)
      
      // Generate each section in parallel for speed
      const [heroContent, aboutContent, servicesContent] = await Promise.all([
        this.generateHeroSection(input),
        this.generateAboutSection(input),
        this.generateServicesSection(input)
      ])

      console.log('AI generation successful!')
      
      // Contact section doesn't need AI generation - use provided info
      const contactContent = this.generateContactSection(input)

      return {
        hero: heroContent,
        about: aboutContent,
        services: servicesContent,
        contact: contactContent
      }
    } catch (error) {
      console.error('Error generating website content:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      // Fallback to basic content if AI fails
      console.log('Using fallback content generation')
      return this.generateFallbackContent(input)
    }
  }

  /**
   * Generate hero section using AI
   */
  private async generateHeroSection(input: GenerationInput) {
    console.log('Generating hero section for:', input.businessName)
    
    const prompt = promptManager.buildContentPrompt(input.industry, 'hero', {
      businessName: input.businessName,
      industry: input.industry,
      description: input.description,
      location: input.contactAddress ? this.extractLocation(input.contactAddress) : ''
    })

    console.log('Hero prompt built, making OpenAI request...')
    console.log('Using OpenAI API key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing')

    const systemContent = promptManager.getSystemPrompt()
    const userContent = prompt + '\n\nGenerate a hero section for this business. Return ONLY a JSON object with title, subtitle, and cta_text fields.'
    
    console.log('System content length:', systemContent.length)
    console.log('User content length:', userContent.length)
    console.log('User content preview:', userContent.substring(0, 200))

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'o4-mini',
      messages: [
        {
          role: 'system',
          content: systemContent
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      max_completion_tokens: 8000
    })

    console.log('OpenAI response received')
    console.log('Full response:', JSON.stringify(response, null, 2))
    
    const content = response.choices[0]?.message?.content
    console.log('Raw OpenAI content:', content)
    
    if (!content) {
      throw new Error('No content generated for hero section')
    }

    try {
      // Clean content - remove markdown code blocks if present
      const cleanedContent = this.extractJSON(content)
      const parsed = JSON.parse(cleanedContent)
      console.log('Successfully parsed hero content:', parsed)
      return parsed
    } catch (parseError) {
      console.error('Failed to parse hero content:', content)
      throw new Error('Invalid JSON response for hero section')
    }
  }

  /**
   * Generate about section using AI
   */
  private async generateAboutSection(input: GenerationInput) {
    const prompt = promptManager.buildContentPrompt(input.industry, 'about', {
      businessName: input.businessName,
      industry: input.industry,
      description: input.description,
      services: input.services.join(', ')
    })

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'o4-mini',
      messages: [
        {
          role: 'system',
          content: promptManager.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt + '\n\nGenerate an about section for this business. Return ONLY a JSON object with title and description fields.'
        }
      ],
      max_completion_tokens: 10000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated for about section')
    }

    try {
      const cleanedContent = this.extractJSON(content)
      return JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('Failed to parse about content:', content)
      throw new Error('Invalid JSON response for about section')
    }
  }

  /**
   * Generate services section using AI
   */
  private async generateServicesSection(input: GenerationInput) {
    const prompt = promptManager.buildContentPrompt(input.industry, 'services', {
      businessName: input.businessName,
      industry: input.industry,
      services: input.services,
      description: input.description
    })

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'o4-mini',
      messages: [
        {
          role: 'system',
          content: promptManager.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt + '\n\nGenerate a services section for this business. Return ONLY a JSON object with title and items array (each item has name and description).'
        }
      ],
      max_completion_tokens: 12000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated for services section')
    }

    try {
      const cleanedContent = this.extractJSON(content)
      return JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('Failed to parse services content:', content)
      throw new Error('Invalid JSON response for services section')
    }
  }

  /**
   * Generate contact section (no AI needed)
   */
  private generateContactSection(input: GenerationInput) {
    return {
      title: 'Contact Us',
      email: input.contactEmail,
      phone: input.contactPhone,
      address: input.contactAddress
    }
  }

  /**
   * Extract JSON from content that might be wrapped in markdown code blocks
   */
  private extractJSON(content: string): string {
    // Remove markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch) {
      return jsonMatch[1].trim()
    }
    
    // If no code blocks, try to find JSON object directly
    const directJsonMatch = content.match(/\{[\s\S]*\}/)
    if (directJsonMatch) {
      return directJsonMatch[0].trim()
    }
    
    // Return original content if no JSON pattern found
    return content.trim()
  }

  /**
   * Extract location from full address for location-based prompts
   */
  private extractLocation(address: string): string {
    // Simple extraction - could be enhanced with geocoding
    const parts = address.split(',')
    return parts.length > 1 ? parts[parts.length - 1].trim() : address
  }

  /**
   * Fallback content generation if AI fails
   */
  private generateFallbackContent(input: GenerationInput): PageContent {
    return {
      hero: {
        title: input.businessName,
        subtitle: `Welcome to ${input.businessName} - ${this.getIndustryTagline(input.industry)}`,
        cta_text: 'Get in Touch'
      },
      about: {
        title: `About ${input.businessName}`,
        description: input.description
      },
      services: {
        title: 'Our Services',
        items: input.services.filter(s => s.trim()).map(service => ({
          name: service.trim(),
          description: `Professional ${service.toLowerCase()} services tailored to your needs.`
        }))
      },
      contact: {
        title: 'Contact Us',
        email: input.contactEmail,
        phone: input.contactPhone,
        address: input.contactAddress
      }
    }
  }

  private getIndustryTagline(industry: string): string {
    const taglines: Record<string, string> = {
      restaurant: 'Delicious food, exceptional service',
      retail: 'Quality products, great prices',
      health: 'Your health, our priority',
      beauty: 'Look and feel your best',
      professional: 'Expert solutions for your needs',
      fitness: 'Achieve your fitness goals',
      education: 'Learn, grow, succeed',
      automotive: 'Reliable service you can trust',
      home: 'Making your house a home',
      technology: 'Innovation meets excellence',
      other: 'Excellence in everything we do'
    }
    
    return taglines[industry] || taglines.other
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator()