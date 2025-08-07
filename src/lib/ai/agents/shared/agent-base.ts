import { Agent, SharedContext, AgentResult } from './interfaces'

export abstract class BaseAgent<TInput, TOutput> implements Agent<TInput, TOutput> {
  abstract name: string
  protected readonly timeout: number = 30000 // 30 seconds
  
  constructor() {}

  abstract process(input: TInput, context: SharedContext): Promise<TOutput>
  abstract validate(output: TOutput): boolean
  abstract getRequiredInputs(): string[]

  // Execute agent with timeout and error handling
  async execute(input: TInput, context: SharedContext): Promise<AgentResult<TOutput>> {
    const startTime = Date.now()
    
    try {
      this.log(context, 'info', `Starting ${this.name}`)
      
      // Log input (sanitized)
      this.log(context, 'info', `${this.name} input:`, this.sanitizeForLogging(input))
      
      // Execute with timeout
      const result = await this.withTimeout(
        this.process(input, context),
        this.timeout,
        `${this.name} timeout`
      )

      // Log output (sanitized)
      this.log(context, 'info', `${this.name} output:`, this.sanitizeForLogging(result))

      // Validate result
      if (!this.validate(result)) {
        this.log(context, 'error', `${this.name} validation failed`, { result: this.sanitizeForLogging(result) })
        throw new Error(`${this.name} produced invalid output`)
      }

      const executionTime = Date.now() - startTime
      this.log(context, 'info', `${this.name} completed successfully`, { 
        executionTime,
        outputKeys: Object.keys(result as any).join(', ')
      })

      return {
        success: true,
        data: result,
        executionTime,
        fallbackUsed: false
      }

    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      this.log(context, 'error', `${this.name} failed`, { 
        error: errorMessage, 
        executionTime,
        input: this.sanitizeForLogging(input)
      })

      return {
        success: false,
        error: errorMessage,
        executionTime,
        fallbackUsed: false
      }
    }
  }

  // Sanitize data for logging (remove sensitive info, truncate large strings)
  protected sanitizeForLogging(data: any): any {
    if (!data) return data
    
    try {
      const sanitized = JSON.parse(JSON.stringify(data))
      
      // Recursively sanitize object
      const sanitizeObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) {
          // Truncate long strings
          if (typeof obj === 'string' && obj.length > 200) {
            return obj.substring(0, 200) + '...'
          }
          return obj
        }
        
        if (Array.isArray(obj)) {
          return obj.map(sanitizeObject)
        }
        
        const sanitizedObj: any = {}
        for (const [key, value] of Object.entries(obj)) {
          // Hide sensitive fields
          if (key.toLowerCase().includes('key') || key.toLowerCase().includes('token')) {
            sanitizedObj[key] = '[HIDDEN]'
          } else {
            sanitizedObj[key] = sanitizeObject(value)
          }
        }
        return sanitizedObj
      }
      
      return sanitizeObject(sanitized)
    } catch (error) {
      return '[LOGGING_ERROR]'
    }
  }

  // Timeout wrapper
  protected async withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    })

    return Promise.race([promise, timeoutPromise])
  }

  // Logging helper
  protected log(
    context: SharedContext, 
    level: 'info' | 'warn' | 'error', 
    message: string, 
    data?: any
  ) {
    const logMessage = `[${context.generationMetadata.traceId}] ${this.name}: ${message}`
    
    if (level === 'error') {
      console.error(logMessage, ...(data !== undefined ? [data] : []))
    } else if (level === 'warn') {
      console.warn(logMessage, ...(data !== undefined ? [data] : []))
    } else {
      console.log(logMessage, ...(data !== undefined ? [data] : []))
    }
  }

  // Language detection helper (shared across agents)
  protected detectLanguage(text: string): string {
    // Simple language detection based on common Swedish words/patterns
    const swedishIndicators = [
      'och', 'att', 'är', 'för', 'med', 'på', 'av', 'det', 'som', 'till', 'vi', 'har',
      'vår', 'våra', 'din', 'dina', 'tjänster', 'service', 'företag', 'kund', 'kunder',
      'kvalitet', 'erfarenhet', 'professionell', 'bästa', 'hjälpa', 'kontakt', 'telefon',
      'ålder', 'år', 'månad', 'vecka', 'svenska', 'sverige', 'stockholm', 'göteborg', 'malmö'
    ]
    
    const textLower = text.toLowerCase()
    const swedishCount = swedishIndicators.filter(word => textLower.includes(word)).length
    
    // Also check for Swedish characters
    const hasSwedishChars = /[åäöÅÄÖ]/.test(text)
    
    return (swedishCount >= 2 || hasSwedishChars) ? 'Swedish' : 'English'
  }
}