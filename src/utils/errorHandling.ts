export class AIGenerationError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'AIGenerationError'
  }
}

export class NetworkError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof AIGenerationError) {
    return `AI Generation Error: ${error.message}`
  }
  
  if (error instanceof NetworkError) {
    return `Network Error: ${error.message}. Please check your connection and try again.`
  }
  
  if (error instanceof ValidationError) {
    return `Validation Error: ${error.message}`
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}