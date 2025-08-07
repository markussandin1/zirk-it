import { randomUUID } from 'crypto'
import { SharedContext, GenerationInput, AgentResults } from './interfaces'

export class ContextManager {
  static createSharedContext(input: GenerationInput): SharedContext {
    return {
      input,
      agentResults: {},
      generationMetadata: {
        traceId: randomUUID(),
        startTime: Date.now(),
        completedAgents: []
      },
      validationRules: {
        requiredElements: ['hero.title', 'hero.subtitle', 'about.description', 'services.items'],
        brandConsistencyThreshold: 7.0,
        qualityThreshold: 7.0
      }
    }
  }

  static markAgentCompleted(context: SharedContext, agentName: string): void {
    if (!context.generationMetadata.completedAgents.includes(agentName)) {
      context.generationMetadata.completedAgents.push(agentName)
    }
  }

  static updateTotalExecutionTime(context: SharedContext): void {
    context.generationMetadata.totalExecutionTime = Date.now() - context.generationMetadata.startTime
  }

  static validateRequiredInputs(input: GenerationInput): string[] {
    const errors: string[] = []
    
    if (!input.businessName?.trim()) {
      errors.push('Business name is required')
    }
    
    if (!input.industry?.trim()) {
      errors.push('Industry is required')
    }
    
    if (!input.description?.trim()) {
      errors.push('Business description is required')
    }
    
    if (!input.services?.length || !input.services.some(s => s.trim())) {
      errors.push('At least one service is required')
    }
    
    return errors
  }

  static getContextSummary(context: SharedContext): object {
    return {
      traceId: context.generationMetadata.traceId,
      completedAgents: context.generationMetadata.completedAgents,
      totalTime: context.generationMetadata.totalExecutionTime,
      businessName: context.input.businessName,
      industry: context.input.industry
    }
  }
}