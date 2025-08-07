import { 
  GenerationInput, 
  PageContent, 
  SharedContext, 
  GenerationResult,
  AgentResult 
} from './shared/interfaces'
import { ContextManager } from './shared/context-manager'
import { BrandContextAgent } from './brand-context'
import { CreativeDirectorAgent } from './creative-director'
import { ContentGenerationAgent } from './content-generation'
import { getSuggestedIconsForIndustry } from '@/lib/icons/icon-categories'
import { QualityAssuranceAgent } from './quality-assurance'

export class MasterOrchestrator {
  private readonly brandContextAgent: BrandContextAgent
  private readonly creativeDirectorAgent: CreativeDirectorAgent
  private readonly contentGenerationAgent: ContentGenerationAgent
  private readonly qualityAssuranceAgent: QualityAssuranceAgent

  constructor() {
    this.brandContextAgent = new BrandContextAgent()
    this.creativeDirectorAgent = new CreativeDirectorAgent()
    this.contentGenerationAgent = new ContentGenerationAgent()
    this.qualityAssuranceAgent = new QualityAssuranceAgent()
  }

  async generateWebsite(input: GenerationInput): Promise<GenerationResult> {
    // Create shared context
    const context = ContextManager.createSharedContext(input)
    
    this.log(context, 'info', 'Starting website generation', { 
      businessName: input.businessName,
      industry: input.industry 
    })

    try {
      // Validate input
      const inputErrors = ContextManager.validateRequiredInputs(input)
      if (inputErrors.length > 0) {
        return {
          success: false,
          error: `Invalid input: ${inputErrors.join(', ')}`,
          context
        }
      }

      // Execute agent workflow
      const result = await this.executeAgentWorkflow(context)
      
      // Update final timing
      ContextManager.updateTotalExecutionTime(context)
      
      this.log(context, 'info', 'Website generation completed', {
        totalTime: context.generationMetadata.totalExecutionTime,
        completedAgents: context.generationMetadata.completedAgents
      })

      return {
        success: true,
        data: result,
        context
      }

    } catch (error) {
      ContextManager.updateTotalExecutionTime(context)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      this.log(context, 'error', 'Website generation failed', { 
        error: errorMessage,
        totalTime: context.generationMetadata.totalExecutionTime
      })

      // Try to return fallback content if possible
      const fallbackContent = this.getFallbackContent(input)
      
      return {
        success: false,
        error: errorMessage,
        data: fallbackContent,
        context
      }
    }
  }

  private async executeAgentWorkflow(context: SharedContext): Promise<PageContent> {
    // Step 1: Brand Context Analysis
    const brandResult = await this.executeBrandContextAgent(context)
    if (!brandResult.success) {
      throw new Error(`Brand context analysis failed: ${brandResult.error}`)
    }
    
    context.agentResults.brandContext = brandResult.data!
    ContextManager.markAgentCompleted(context, 'brand-context')

    // Step 2: Creative Director - Design System Generation
    const designResult = await this.executeCreativeDirectorAgent(context)
    if (!designResult.success) {
      throw new Error(`Design system generation failed: ${designResult.error}`)
    }
    
    context.agentResults.creativeDirector = designResult.data!
    ContextManager.markAgentCompleted(context, 'creative-director')

    // Step 3: Content Generation with Design Context
    const contentResult = await this.executeContentGenerationAgent(context)
    if (!contentResult.success) {
      throw new Error(`Content generation failed: ${contentResult.error}`)
    }
    
    context.agentResults.contentGeneration = contentResult.data!
    ContextManager.markAgentCompleted(context, 'content-generation')

    // Step 3: Quality Assurance & Enhancement
    const qaResult = await this.executeQualityAssuranceAgent(context)
    if (!qaResult.success) {
      this.log(context, 'warn', 'QA failed, using unenhanced content', { error: qaResult.error })
      // Return content generation result as fallback
      return this.convertToPageContent(context.agentResults.contentGeneration!, context)
    }
    
    context.agentResults.qualityAssurance = qaResult.data!
    ContextManager.markAgentCompleted(context, 'quality-assurance')

    // Convert final result to PageContent format
    return this.convertToPageContent(qaResult.data!, context)
  }

  private async executeBrandContextAgent(context: SharedContext): Promise<AgentResult<any>> {
    try {
      return await this.brandContextAgent.execute(context.input, context)
    } catch (error) {
      // Fallback to generic brand context
      const fallbackBrand = this.getFallbackBrandContext(context.input)
      return {
        success: true,
        data: fallbackBrand,
        executionTime: 0,
        fallbackUsed: true
      }
    }
  }

  private async executeCreativeDirectorAgent(context: SharedContext): Promise<AgentResult<any>> {
    if (!context.agentResults.brandContext) {
      throw new Error('Brand context is required for Creative Director')
    }
    
    this.log(context, 'info', 'Starting creative-director')
    
    try {
      const result = await this.creativeDirectorAgent.execute(
        { brandContext: context.agentResults.brandContext },
        context
      )
      
      this.log(context, 'info', 'creative-director completed successfully', { 
        executionTime: result.executionTime,
        outputKeys: result.data ? Object.keys(result.data).join(', ') : 'none'
      })
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.log(context, 'error', 'creative-director failed', { error: errorMessage })
      return { success: false, error: errorMessage, executionTime: 0, fallbackUsed: false }
    }
  }

  private async executeContentGenerationAgent(context: SharedContext): Promise<AgentResult<any>> {
    if (!context.agentResults.brandContext) {
      throw new Error('Brand context is required for content generation')
    }
    
    return await this.contentGenerationAgent.execute(
      { input: context.input, brandContext: context.agentResults.brandContext },
      context
    )
  }

  private async executeQualityAssuranceAgent(context: SharedContext): Promise<AgentResult<any>> {
    if (!context.agentResults.contentGeneration) {
      throw new Error('Content generation result is required for quality assurance')
    }
    
    return await this.qualityAssuranceAgent.execute(
      { 
        content: context.agentResults.contentGeneration,
        brandContext: context.agentResults.brandContext!,
        input: context.input
      },
      context
    )
  }

  private convertToPageContent(qaOutput: any, context?: SharedContext): PageContent {
    // Convert QualityAssuranceOutput to PageContent format
    return {
      hero: qaOutput.hero,
      about: qaOutput.about,
      services: qaOutput.services,
      contact: qaOutput.contact,
      imageUrl: qaOutput.imageUrl,
      // Include design tokens from Creative Director
      designTokens: context?.agentResults?.creativeDirector || undefined
    }
  }

  private getFallbackBrandContext(input: GenerationInput): any {
    return {
      personality: ['professional', 'reliable'],
      tone: {
        primary: 'professional',
        modifiers: ['friendly'],
        description: 'Professional and friendly'
      },
      targetAudience: 'Local customers',
      uniqueValueProps: ['Quality service', 'Local expertise'],
      messagingFramework: {
        primaryMessage: `${input.businessName} - Your trusted partner`,
        supportingMessages: ['Quality service you can rely on'],
        avoidanceList: ['overly technical jargon']
      },
      competitorDifferentiators: ['Personal service', 'Local knowledge'],
      keywords: [input.industry, input.businessName.toLowerCase()],
      industry: input.industry,
      confidence: 0.5,
      executionTime: 0
    }
  }

  private getFallbackContent(input: GenerationInput): PageContent {
    // Get suggested icons for this industry
    const suggestedIcons = getSuggestedIconsForIndustry(input.industry)
    
    return {
      hero: {
        title: input.businessName,
        subtitle: `Welcome to ${input.businessName} - Your trusted partner`,
        cta_text: 'Get Started'
      },
      about: {
        title: `About ${input.businessName}`,
        description: input.description
      },
      services: {
        title: 'Our Services',
        items: input.services.filter(s => s.trim()).map((service, index) => ({
          name: service.trim(),
          description: `Professional ${service.toLowerCase()} services.`,
          price: null,
          // Use suggested icons, cycling through them if we have more services than icons
          icon: suggestedIcons[index % suggestedIcons.length] || 'Star'
        }))
      },
      contact: {
        title: 'Contact Us',
        email: input.contactEmail || null,
        phone: input.contactPhone || null,
        address: input.contactAddress || null
      }
    }
  }

  private log(
    context: SharedContext, 
    level: 'info' | 'warn' | 'error', 
    message: string, 
    data?: any
  ) {
    const logMessage = `[${context.generationMetadata.traceId}] orchestrator: ${message}`
    
    if (level === 'error') {
      console.error(logMessage, ...(data !== undefined ? [data] : []))
    } else if (level === 'warn') {
      console.warn(logMessage, ...(data !== undefined ? [data] : []))
    } else {
      console.log(logMessage, ...(data !== undefined ? [data] : []))
    }
  }
}

// Export singleton instance
export const masterOrchestrator = new MasterOrchestrator()