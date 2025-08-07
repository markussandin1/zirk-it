import OpenAI from 'openai'
import { BaseAgent } from './shared/agent-base'
import { BrandContext, SharedContext } from './shared/interfaces'
import { DesignTokens, CreativeDirectorOutput, IndustryDesignGuide, PersonalityDesignMapping } from './shared/design-tokens'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CreativeDirectorInput {
  brandContext: BrandContext
}

export class CreativeDirectorAgent extends BaseAgent<CreativeDirectorInput, CreativeDirectorOutput> {
  name = 'creative-director'

  // Industry-specific design guidelines - Professional 2024/2025 Standards
  private industryGuides: Record<string, IndustryDesignGuide> = {
    'restaurant': {
      preferredColors: ['#2C1810', '#D2691E', '#8B4513', '#F5DEB3', '#CD853F', '#A0522D'],
      avoidColors: ['#000080', '#4B0082', '#00FFFF', '#FF00FF'],
      typographyStyle: 'serif',
      layoutPreference: 'warm',
      componentPreferences: { formality: 'mixed', visualWeight: 'medium' }
    },
    'technology': {
      preferredColors: ['#0F1419', '#2563EB', '#06B6D4', '#10B981', '#F1F5F9', '#64748B'],
      avoidColors: ['#8B4513', '#A0522D', '#CD853F', '#FF69B4'],
      typographyStyle: 'sans-serif',
      layoutPreference: 'modern',
      componentPreferences: { formality: 'formal', visualWeight: 'medium' }
    },
    'bilverkstad': {
      preferredColors: ['#1A1A1A', '#E31E24', '#FF6B35', '#F4F4F4', '#CCCCCC', '#4A4A4A'],
      avoidColors: ['#FFB6C1', '#F0E68C', '#E6E6FA', '#FF69B4'],
      typographyStyle: 'sans-serif',
      layoutPreference: 'modern',
      componentPreferences: { formality: 'mixed', visualWeight: 'bold' }
    },
    'automotive': {
      preferredColors: ['#1A1A1A', '#E31E24', '#FF6B35', '#F4F4F4', '#CCCCCC', '#4A4A4A'],
      avoidColors: ['#FFB6C1', '#F0E68C', '#E6E6FA', '#FF69B4'],
      typographyStyle: 'sans-serif',
      layoutPreference: 'modern',
      componentPreferences: { formality: 'mixed', visualWeight: 'bold' }
    },
    'zoobutik': {
      preferredColors: ['#2D5016', '#8FBC8F', '#D2691E', '#F5F5DC', '#8B7355', '#4F7942'],
      avoidColors: ['#FF1493', '#00FFFF', '#FF00FF', '#2F4F4F'],
      typographyStyle: 'mixed',
      layoutPreference: 'warm',
      componentPreferences: { formality: 'mixed', visualWeight: 'medium' }
    },
    'djurhandel': {
      preferredColors: ['#2D5016', '#8FBC8F', '#D2691E', '#F5F5DC', '#8B7355', '#4F7942'],
      avoidColors: ['#FF1493', '#00FFFF', '#FF00FF', '#2F4F4F'],
      typographyStyle: 'mixed',
      layoutPreference: 'warm',
      componentPreferences: { formality: 'mixed', visualWeight: 'medium' }
    },
    'beauty': {
      preferredColors: ['#FFB6C1', '#FF69B4', '#9370DB', '#DDA0DD', '#F0E68C'],
      avoidColors: ['#2F4F4F', '#696969', '#8B0000'],
      typographyStyle: 'mixed',
      layoutPreference: 'creative',
      componentPreferences: { formality: 'casual', visualWeight: 'light' }
    },
    'webbdesign och digital marknadsföring': {
      preferredColors: ['#4169E1', '#1E90FF', '#FF6347', '#32CD32', '#9370DB'],
      avoidColors: ['#8B4513', '#A0522D'],
      typographyStyle: 'sans-serif', 
      layoutPreference: 'creative',
      componentPreferences: { formality: 'mixed', visualWeight: 'medium' }
    },
    'health': {
      preferredColors: ['#4682B4', '#87CEEB', '#20B2AA', '#32CD32', '#F0F8FF'],
      avoidColors: ['#B22222', '#DC143C', '#8B0000'],
      typographyStyle: 'sans-serif',
      layoutPreference: 'corporate',
      componentPreferences: { formality: 'formal', visualWeight: 'light' }
    },
    'professional': {
      preferredColors: ['#2F4F4F', '#4682B4', '#708090', '#B0C4DE', '#1E90FF'],
      avoidColors: ['#FF1493', '#FF69B4', '#FF6347'],
      typographyStyle: 'serif',
      layoutPreference: 'corporate',
      componentPreferences: { formality: 'formal', visualWeight: 'light' }
    },
    'retail': {
      preferredColors: ['#FF6347', '#FF69B4', '#FFD700', '#32CD32', '#9370DB'],
      avoidColors: ['#2F4F4F', '#696969', '#778899'],
      typographyStyle: 'sans-serif',
      layoutPreference: 'creative',
      componentPreferences: { formality: 'casual', visualWeight: 'bold' }
    }
  }

  // Professional personality-to-design mapping - 2024/2025 Standards
  private personalityMappings: PersonalityDesignMapping = {
    'professional': {
      colors: ['#1E293B', '#3B82F6', '#64748B'],
      typography: 'serif',
      layout: 'corporate',
      components: { cardStyle: 'rounded', buttonStyle: 'solid', shadowIntensity: 'subtle' }
    },
    'vänlig': {
      colors: ['#0F766E', '#14B8A6', '#FCD34D'],
      typography: 'sans-serif',
      layout: 'warm',
      components: { cardStyle: 'rounded', buttonStyle: 'solid', shadowIntensity: 'medium' }
    },
    'kreativ': {
      colors: ['#581C87', '#F59E0B', '#10B981'],
      typography: 'mixed',
      layout: 'creative', 
      components: { cardStyle: 'organic', buttonStyle: 'outline', shadowIntensity: 'strong' }
    },
    'innovativ': {
      colors: ['#1E40AF', '#059669', '#DC2626'],
      typography: 'sans-serif',
      layout: 'modern',
      components: { cardStyle: 'sharp', buttonStyle: 'minimal', shadowIntensity: 'subtle' }
    },
    'pålitlig': {
      colors: ['#374151', '#6B7280', '#1F2937'],
      typography: 'serif',
      layout: 'corporate',
      components: { cardStyle: 'rounded', buttonStyle: 'solid', shadowIntensity: 'subtle' }
    },
    'industrial': {
      colors: ['#1A1A1A', '#E31E24', '#4A4A4A'],
      typography: 'sans-serif',
      layout: 'modern',
      components: { cardStyle: 'sharp', buttonStyle: 'solid', shadowIntensity: 'strong' }
    },
    'friendly-professional': {
      colors: ['#2D5016', '#8FBC8F', '#D2691E'],
      typography: 'mixed',
      layout: 'warm',
      components: { cardStyle: 'rounded', buttonStyle: 'solid', shadowIntensity: 'medium' }
    }
  }

  async process(input: CreativeDirectorInput, context: SharedContext): Promise<CreativeDirectorOutput> {
    const designSystem = await this.generateDesignSystem(input.brandContext)
    
    return {
      ...designSystem,
      executionTime: 0 // Will be set by base class
    }
  }

  validate(output: CreativeDirectorOutput): boolean {
    try {
      return !!(
        output.colorPalette?.primary &&
        output.colorPalette?.secondary &&
        output.typography?.headingFont &&
        output.typography?.bodyFont &&
        output.layoutStyle &&
        output.designReasoning
      )
    } catch {
      return false
    }
  }

  getRequiredInputs(): string[] {
    return ['brandContext']
  }

  private async generateDesignSystem(brandContext: BrandContext): Promise<CreativeDirectorOutput> {
    const industryGuide = this.getIndustryGuide(brandContext.industry)
    const personalityMapping = this.getPersonalityMapping(brandContext.personality)
    
    const prompt = this.buildDesignPrompt(brandContext, industryGuide, personalityMapping)
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a Professional Creative Director specializing in sophisticated, industry-specific web design for 2024/2025.

🎯 PROFESSIONAL DESIGN STANDARDS (MANDATORY):
1. COLOR HARMONY: Apply 60-30-10 rule (60% neutral base, 30% primary brand, 10% accent)
2. TYPOGRAPHY SOPHISTICATION: Combine complementary font pairs (never single fonts)
3. ACCESSIBILITY: Ensure minimum 4.5:1 contrast ratio for WCAG AA compliance
4. VISUAL HIERARCHY: Use strategic spacing, size, and color for clear information flow
5. MODERN AESTHETICS: Subtle gradients, organic shapes, strategic whitespace
6. INDUSTRY PSYCHOLOGY: Colors must evoke appropriate emotional responses

🚫 ABSOLUTELY FORBIDDEN (AMATEUR MISTAKES):
- Bright, saturated primary colors without neutral balance (#FF0000, #00FF00)
- Generic font choices (Arial, Roboto, Times New Roman)
- Monochromatic schemes without depth
- Corporate blue-grey for non-professional industries
- Inconsistent spacing and visual weight

🎨 INDUSTRY-SPECIFIC PROFESSIONAL STANDARDS:

AUTOMOTIVE/BILVERKSTAD: 
- Psychology: Power, Precision, Trust, Safety
- Colors: Deep blacks (#1A1A1A) + Racing reds (#E31E24) + Safety oranges (#FF6B35)
- Typography: Industrial strength (Oswald + Source Sans Pro)
- Layout: Bold, geometric, high-contrast

PET CARE/ZOOBUTIK:
- Psychology: Care, Nature, Trust, Warmth
- Colors: Forest greens (#2D5016) + Natural browns (#D2691E) + Cream neutrals (#F5F5DC)  
- Typography: Friendly professional (Poppins + Inter)
- Layout: Organic curves, warm spacing

TECHNOLOGY:
- Psychology: Innovation, Efficiency, Future
- Colors: Tech blues (#0F1419, #2563EB) + Cyan accents (#06B6D4) + Clean grays (#F1F5F9)
- Typography: Modern precision (Inter + Roboto Mono)

RESTAURANT:
- Psychology: Appetite, Warmth, Social
- Colors: Rich browns (#2C1810) + Appetite oranges (#D2691E) + Cream (#F5DEB3)
- Typography: Warm elegance (Playfair Display + Open Sans)

Return ONLY a JSON object with this exact structure:
{
  "colorPalette": {
    "primary": "#HEX_COLOR",
    "secondary": "#HEX_COLOR", 
    "accent": "#HEX_COLOR",
    "neutral": {
      "light": "#HEX_COLOR",
      "medium": "#HEX_COLOR",
      "dark": "#HEX_COLOR"
    }
  },
  "typography": {
    "headingFont": "Font Name",
    "bodyFont": "Font Name",
    "fontScale": {
      "hero": "text-size",
      "heading": "text-size", 
      "body": "text-size",
      "small": "text-size"
    }
  },
  "layoutStyle": "corporate|warm|creative|minimal|modern",
  "components": {
    "cardStyle": "rounded|sharp|organic",
    "buttonStyle": "solid|outline|minimal", 
    "shadowIntensity": "none|subtle|medium|strong"
  },
  "spacing": {
    "sectionPadding": "py-value",
    "cardPadding": "p-value",
    "elementGap": "gap-value"
  },
  "designReasoning": "Explain why you made these design choices",
  "industryAlignment": "How the design fits the industry",
  "brandAlignment": "How the design matches the brand personality",
  "confidence": 0.0-1.0
}

Use exact Tailwind CSS classes for spacing and sizing. Choose web-safe fonts that match the brand tone.`
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
      throw new Error('No design system generated from Creative Director')
    }

    try {
      const cleanedContent = this.extractJSON(content)
      const result = JSON.parse(cleanedContent)
      
      // Validate and provide fallbacks
      return this.validateAndEnhanceDesignSystem(result, brandContext)
    } catch (error) {
      console.error('Failed to parse Creative Director response:', content)
      throw new Error('Invalid design system response')
    }
  }

  private buildDesignPrompt(
    brandContext: BrandContext, 
    industryGuide: IndustryDesignGuide,
    personalityMapping: any
  ): string {
    return `Create a UNIQUE design system for this business. DO NOT use generic corporate styling.

BUSINESS DETAILS:
- Industry: ${brandContext.industry}
- Personality: ${brandContext.personality.join(', ')}
- Tone: ${brandContext.tone.primary} (${brandContext.tone.modifiers.join(', ')})
- Target Audience: ${brandContext.targetAudience}
- Primary Message: ${brandContext.messagingFramework.primaryMessage}

MANDATORY INDUSTRY REQUIREMENTS FOR "${brandContext.industry.toUpperCase()}":
- MUST USE these colors: ${industryGuide.preferredColors.join(', ')}
- NEVER USE these colors: ${industryGuide.avoidColors.join(', ')}
- Typography: ${industryGuide.typographyStyle} fonts ONLY
- Layout: ${industryGuide.layoutPreference} style REQUIRED
- Formality: ${industryGuide.componentPreferences.formality}

SPECIFIC INSTRUCTIONS FOR ${brandContext.industry}:
${this.getIndustrySpecificInstructions(brandContext.industry)}

CRITICAL DESIGN REQUIREMENTS:
1. PRIMARY COLOR: Choose from the preferred colors list - NOT grey or blue-grey
2. TYPOGRAPHY: Use ${industryGuide.typographyStyle === 'sans-serif' ? 'modern sans-serif fonts (Inter, Open Sans, Roboto)' : industryGuide.typographyStyle === 'serif' ? 'elegant serif fonts (Playfair Display, Lora)' : 'creative mixed typography'}
3. LAYOUT: Use "${industryGuide.layoutPreference}" layout style
4. COMPONENTS: Match ${industryGuide.componentPreferences.formality} formality level
5. DIFFERENTIATION: This must look completely different from other industries

Make this design system IMMEDIATELY recognizable as a ${brandContext.industry} business.`
  }

  private getIndustrySpecificInstructions(industry: string): string {
    const industryInstructions: Record<string, string> = {
      'bilverkstad': 'Use STRONG, BOLD colors like bright reds (#DC143C) or oranges (#FF4500). This is a HANDS-ON business - use sans-serif fonts like "Arial Black" or "Roboto Bold". Layout should be "modern" with sharp edges, not rounded.',
      'automotive': 'Use STRONG, BOLD colors like bright reds (#DC143C) or oranges (#FF4500). This is a HANDS-ON business - use sans-serif fonts like "Arial Black" or "Roboto Bold". Layout should be "modern" with sharp edges, not rounded.',
      'zoobutik': 'Use NATURE colors - bright greens (#228B22), warm oranges (#FF6347), or playful purples (#9370DB). This is about ANIMALS and FUN - use friendly fonts like "Open Sans" or "Nunito". Layout should be "warm" with rounded components.',
      'djurhandel': 'Use NATURE colors - bright greens (#228B22), warm oranges (#FF6347), or playful purples (#9370DB). This is about ANIMALS and FUN - use friendly fonts like "Open Sans" or "Nunito". Layout should be "warm" with rounded components.',
      'restaurant': 'Use APPETITE colors - warm reds (#B22222), rich browns (#CD853F), or golden yellows (#DAA520). This is about FOOD and WARMTH - use inviting fonts. Layout should be "warm" with organic shapes.',
      'beauty': 'Use ELEGANT colors - soft pinks (#FFB6C1), rich purples (#9370DB), or champagne golds (#F0E68C). This is about BEAUTY and LUXURY - use stylish fonts. Layout should be "creative" with soft curves.',
      'technology': 'Use MODERN colors - electric blues (#0066CC), bright teals (#00CED1), or tech greens (#32CD32). This is CUTTING-EDGE - use clean sans-serif fonts like "Inter" or "Roboto". Layout should be "modern" with geometric shapes.'
    }

    const key = industry.toLowerCase()
    return industryInstructions[key] || 'Use colors and typography that reflect the industry character and target audience expectations.'
  }

  private getIndustryGuide(industry: string): IndustryDesignGuide {
    // Try exact match first
    const exactMatch = this.industryGuides[industry.toLowerCase()]
    if (exactMatch) return exactMatch

    // Try partial match
    for (const [key, guide] of Object.entries(this.industryGuides)) {
      if (industry.toLowerCase().includes(key) || key.includes(industry.toLowerCase())) {
        return guide
      }
    }

    // Default fallback
    return this.industryGuides['professional']
  }

  private getPersonalityMapping(personalities: string[]): any {
    // Find the best matching personality
    for (const personality of personalities) {
      const mapping = this.personalityMappings[personality.toLowerCase()]
      if (mapping) return mapping
    }

    // Default fallback
    return this.personalityMappings['professional']
  }

  private validateAndEnhanceDesignSystem(
    result: any, 
    brandContext: BrandContext
  ): CreativeDirectorOutput {
    // Only provide fallbacks for critical missing fields - trust AI output mostly
    const industryGuide = this.getIndustryGuide(brandContext.industry)
    
    return {
      colorPalette: {
        primary: result.colorPalette?.primary || industryGuide.preferredColors[0],
        secondary: result.colorPalette?.secondary || industryGuide.preferredColors[1], 
        accent: result.colorPalette?.accent || industryGuide.preferredColors[2],
        neutral: {
          light: result.colorPalette?.neutral?.light || '#F8F9FA',
          medium: result.colorPalette?.neutral?.medium || '#6C757D',
          dark: result.colorPalette?.neutral?.dark || '#212529'
        }
      },
      typography: {
        headingFont: result.typography?.headingFont || (industryGuide.typographyStyle === 'sans-serif' ? 'Inter' : 'Georgia'),
        bodyFont: result.typography?.bodyFont || (industryGuide.typographyStyle === 'sans-serif' ? 'Inter' : 'Georgia'),
        fontScale: {
          hero: result.typography?.fontScale?.hero || 'text-5xl',
          heading: result.typography?.fontScale?.heading || 'text-3xl',
          body: result.typography?.fontScale?.body || 'text-base',
          small: result.typography?.fontScale?.small || 'text-sm'
        }
      },
      layoutStyle: result.layoutStyle || industryGuide.layoutPreference,
      components: {
        cardStyle: result.components?.cardStyle || 'rounded',
        buttonStyle: result.components?.buttonStyle || 'solid',
        shadowIntensity: result.components?.shadowIntensity || 'subtle'
      },
      spacing: {
        sectionPadding: result.spacing?.sectionPadding || 'py-16',
        cardPadding: result.spacing?.cardPadding || 'p-6',
        elementGap: result.spacing?.elementGap || 'gap-6'
      },
      designReasoning: result.designReasoning || `Design system created for ${brandContext.industry} industry`,
      industryAlignment: result.industryAlignment || `Colors and typography chosen for ${brandContext.industry}`,
      brandAlignment: result.brandAlignment || `Design matches ${brandContext.personality.join(', ')} personality`,
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.8,
      executionTime: 0
    }
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