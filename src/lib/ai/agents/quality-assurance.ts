import OpenAI from 'openai'
import { BaseAgent } from './shared/agent-base'
import { 
  GenerationInput, 
  BrandContext, 
  ContentGenerationOutput, 
  QualityAssuranceOutput, 
  SharedContext,
  ValidationReport,
  ValidationIssue
} from './shared/interfaces'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface QualityAssuranceInput {
  content: ContentGenerationOutput
  brandContext: BrandContext
  input: GenerationInput
}

export class QualityAssuranceAgent extends BaseAgent<QualityAssuranceInput, QualityAssuranceOutput> {
  name = 'quality-assurance'

  async process(input: QualityAssuranceInput, context: SharedContext): Promise<QualityAssuranceOutput> {
    // Step 1: Validate the content
    const validationReport = await this.validateContent(input)
    
    // Step 2: Apply basic optimizations if quality is below threshold
    let enhancedContent = input.content
    let enhancementsApplied: string[] = []
    
    if (validationReport.score < context.validationRules.qualityThreshold) {
      const optimization = await this.applyBasicOptimizations(input)
      enhancedContent = optimization.content
      enhancementsApplied = optimization.enhancements
    }
    
    // Step 3: Calculate final quality score
    const finalValidation = await this.validateContent({
      ...input,
      content: enhancedContent
    })

    return {
      ...enhancedContent,
      qualityScore: finalValidation.score,
      enhancementsApplied,
      validationReport: finalValidation,
      executionTime: 0 // Will be set by base class
    }
  }

  validate(output: QualityAssuranceOutput): boolean {
    try {
      return !!(
        output.hero?.title &&
        output.hero?.subtitle &&
        output.about?.description &&
        output.services?.items?.length > 0 &&
        output.contact?.title &&
        output.qualityScore !== undefined &&
        output.validationReport
      )
    } catch {
      return false
    }
  }

  getRequiredInputs(): string[] {
    return ['content', 'brandContext', 'input']
  }

  private async validateContent(input: QualityAssuranceInput): Promise<ValidationReport> {
    const language = this.detectLanguage(
      `${input.input.businessName} ${input.input.description}`
    )
    
    const prompt = this.buildValidationPrompt(input, language)

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a quality assurance expert for website content. Analyze content quality and brand consistency.

Return ONLY a JSON object with this structure:
{
  "brandConsistency": number (1-10),
  "contentQuality": number (1-10), 
  "technicalValidity": number (1-10),
  "overallScore": number (1-10),
  "issues": [
    {
      "type": "brand_consistency|content_quality|technical|grammar",
      "severity": "low|medium|high",
      "description": "issue description",
      "location": "hero.title|about.description|etc",
      "suggestedFix": "how to fix this"
    }
  ],
  "fixes": ["list of specific improvements needed"]
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 2000,
      temperature: 0.3
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No validation response generated')
    }

    try {
      const result = JSON.parse(this.extractJSON(content))
      return {
        score: result.overallScore,
        issues: result.issues || [],
        overallAssessment: `Brand: ${result.brandConsistency}/10, Quality: ${result.contentQuality}/10, Technical: ${result.technicalValidity}/10`
      }
    } catch (error) {
      console.error('Failed to parse validation response:', content)
      // Return basic validation
      return this.performBasicValidation(input)
    }
  }

  private async applyBasicOptimizations(
    input: QualityAssuranceInput
  ): Promise<{ content: ContentGenerationOutput; enhancements: string[] }> {
    const language = this.detectLanguage(
      `${input.input.businessName} ${input.input.description}`
    )
    
    const prompt = this.buildOptimizationPrompt(input, language)

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a content optimization expert. Improve website content while maintaining brand consistency.

Return ONLY a JSON object with this structure:
{
  "optimizedContent": {
    "hero": {
      "title": "improved title",
      "subtitle": "improved subtitle",
      "cta_text": "improved CTA"
    },
    "about": {
      "title": "improved title",
      "description": "improved description"
    },
    "services": {
      "title": "improved title", 
      "items": [
        {
          "name": "service name",
          "description": "improved description",
          "price": "price or null"
        }
      ]
    },
    "contact": {
      "title": "improved title",
      "email": "email or null",
      "phone": "phone or null",
      "address": "address or null"
    }
  },
  "enhancements": ["list of improvements made"]
}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_completion_tokens: 3000,
      temperature: 0.7
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      // Return original content if optimization fails
      return {
        content: input.content,
        enhancements: ['Optimization failed - using original content']
      }
    }

    try {
      const result = JSON.parse(this.extractJSON(content))
      return {
        content: result.optimizedContent,
        enhancements: result.enhancements || ['Basic optimization applied']
      }
    } catch (error) {
      console.error('Failed to parse optimization response:', content)
      return {
        content: input.content,
        enhancements: ['Optimization parsing failed - using original content']
      }
    }
  }

  private buildValidationPrompt(input: QualityAssuranceInput, language: string): string {
    return `Analyze this website content for quality and brand consistency:

BRAND GUIDELINES:
- Personality: ${input.brandContext.personality.join(', ')}
- Tone: ${input.brandContext.tone.description}
- Target Audience: ${input.brandContext.targetAudience}
- Primary Message: ${input.brandContext.messagingFramework.primaryMessage}
- Avoid: ${input.brandContext.messagingFramework.avoidanceList.join(', ')}

BUSINESS INFO:
- Name: ${input.input.businessName}
- Industry: ${input.input.industry}
- Services: ${input.input.services.join(', ')}

CONTENT TO ANALYZE:
${JSON.stringify(input.content, null, 2)}

Evaluate:
1. **Brand Consistency**: Does the content match the specified personality and tone?
2. **Content Quality**: Is it engaging, benefit-focused, and professional?
3. **Technical Validity**: Are all required fields present and properly formatted?
4. **Grammar & Style**: Is the language correct and appropriate?

Focus on identifying specific issues and providing actionable feedback for improvement.`
  }

  private buildOptimizationPrompt(input: QualityAssuranceInput, language: string): string {
    return `Improve this website content while maintaining brand consistency:

BRAND GUIDELINES (MUST FOLLOW):
- Personality: ${input.brandContext.personality.join(', ')}
- Tone: ${input.brandContext.tone.description}
- Target Audience: ${input.brandContext.targetAudience}
- Key Messages: ${input.brandContext.messagingFramework.primaryMessage}
- Unique Values: ${input.brandContext.uniqueValueProps.join(', ')}

CURRENT CONTENT:
${JSON.stringify(input.content, null, 2)}

OPTIMIZATION GOALS:
1. **Enhance Headlines**: Make them more compelling and benefit-focused
2. **Improve CTAs**: Make call-to-action buttons more persuasive
3. **Strengthen Value Props**: Better highlight unique benefits
4. **Fix Grammar/Style**: Correct any language issues
5. **Boost Engagement**: Make content more appealing to target audience

IMPORTANT: 
- Write in ${language}
- Keep the same brand tone and personality
- Maintain professional quality
- Ensure all contact information is preserved exactly as provided
- Make improvements feel natural, not forced`
  }

  private performBasicValidation(input: QualityAssuranceInput): ValidationReport {
    const issues: ValidationIssue[] = []
    let score = 10

    // Check required fields
    if (!input.content.hero?.title) {
      issues.push({
        type: 'technical',
        severity: 'high',
        description: 'Missing hero title',
        location: 'hero.title'
      })
      score -= 2
    }

    if (!input.content.about?.description || input.content.about.description.length < 50) {
      issues.push({
        type: 'content_quality',
        severity: 'medium',
        description: 'About description too short or missing',
        location: 'about.description'
      })
      score -= 1
    }

    if (!input.content.services?.items?.length) {
      issues.push({
        type: 'technical',
        severity: 'high',
        description: 'No services listed',
        location: 'services.items'
      })
      score -= 2
    }

    return {
      score: Math.max(score, 1),
      issues,
      overallAssessment: `Basic validation completed with ${issues.length} issues found`
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