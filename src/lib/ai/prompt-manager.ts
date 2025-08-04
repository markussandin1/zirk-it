import { readFileSync } from 'fs'
import { join } from 'path'

export class PromptManager {
  private static instance: PromptManager
  private promptCache: Map<string, string> = new Map()
  private readonly promptsPath: string

  private constructor() {
    this.promptsPath = join(process.cwd(), 'src', 'prompts')
  }

  public static getInstance(): PromptManager {
    if (!PromptManager.instance) {
      PromptManager.instance = new PromptManager()
    }
    return PromptManager.instance
  }

  /**
   * Load and cache a prompt from file
   */
  private loadPrompt(category: string, name: string): string {
    const cacheKey = `${category}/${name}`
    
    if (this.promptCache.has(cacheKey)) {
      return this.promptCache.get(cacheKey)!
    }

    try {
      const filePath = join(this.promptsPath, category, `${name}.md`)
      const content = readFileSync(filePath, 'utf-8')
      this.promptCache.set(cacheKey, content)
      return content
    } catch (error) {
      console.error(`Failed to load prompt: ${cacheKey}`, error)
      return ''
    }
  }

  /**
   * Get system prompt
   */
  public getSystemPrompt(): string {
    return this.loadPrompt('system', 'base-system')
  }

  /**
   * Get industry-specific prompt
   */
  public getIndustryPrompt(industry: string): string {
    return this.loadPrompt('industry', industry)
  }

  /**
   * Get section-specific prompt
   */
  public getSectionPrompt(section: string): string {
    return this.loadPrompt('sections', section)
  }

  /**
   * Replace variables in prompt template
   */
  public replaceVariables(prompt: string, variables: Record<string, any>): string {
    let result = prompt
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g')
      result = result.replace(regex, String(value))
    }
    
    return result
  }

  /**
   * Build complete prompt for content generation
   */
  public buildContentPrompt(
    industry: string,
    section: string,
    variables: Record<string, any>
  ): string {
    const systemPrompt = this.getSystemPrompt()
    const industryPrompt = this.getIndustryPrompt(industry)
    const sectionPrompt = this.getSectionPrompt(section)

    // Combine prompts
    let fullPrompt = systemPrompt + '\n\n'
    
    if (industryPrompt) {
      fullPrompt += '## Industry Context:\n' + industryPrompt + '\n\n'
    }
    
    fullPrompt += '## Task:\n' + sectionPrompt

    // Replace variables
    return this.replaceVariables(fullPrompt, variables)
  }

  /**
   * Clear cache (useful for development/testing)
   */
  public clearCache(): void {
    this.promptCache.clear()
  }

  /**
   * Get all available industries
   */
  public getAvailableIndustries(): string[] {
    // This would ideally read from the filesystem, but for now return known industries
    return [
      'restaurant',
      'retail', 
      'health',
      'beauty',
      'professional',
      'fitness',
      'education',
      'automotive',
      'home',
      'technology',
      'other'
    ]
  }

  /**
   * Get all available sections
   */
  public getAvailableSections(): string[] {
    return ['hero', 'about', 'services', 'contact']
  }
}

// Export singleton instance
export const promptManager = PromptManager.getInstance()