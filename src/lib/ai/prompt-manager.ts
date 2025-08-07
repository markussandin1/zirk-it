import { readFileSync } from 'fs';
import { join } from 'path';

export class PromptManager {
  private static instance: PromptManager;
  private promptCache: Map<string, string> = new Map();
  private readonly promptsPath: string;

  private constructor() {
    this.promptsPath = join(process.cwd(), 'src', 'prompts');
  }

  public static getInstance(): PromptManager {
    if (!PromptManager.instance) {
      PromptManager.instance = new PromptManager();
    }
    return PromptManager.instance;
  }

  private loadPrompt(promptPath: string): string {
    if (this.promptCache.has(promptPath)) {
      return this.promptCache.get(promptPath)!;
    }

    try {
      const filePath = join(this.promptsPath, promptPath);
      const content = readFileSync(filePath, 'utf-8');
      this.promptCache.set(promptPath, content);
      return content;
    } catch (error) {
      console.error(`Failed to load prompt: ${promptPath}`, error);
      return '';
    }
  }

  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, String(value));
    }
    return result;
  }

  public buildPrompt(promptPath: string, variables: Record<string, any>): string {
    const template = this.loadPrompt(promptPath);
    if (!template) {
      return '';
    }
    return this.replaceVariables(template, variables);
  }

  public buildCompositePrompt(sections: string[], variables: Record<string, any>): string {
    const systemPrompt = this.loadPrompt('system/base-system.md');
    let fullPrompt = systemPrompt + '\n\n';

    for (const section of sections) {
        const sectionPrompt = this.loadPrompt(section);
        if(sectionPrompt) {
            fullPrompt += `## Task for ${section}:\n` + sectionPrompt + '\n\n';
        }
    }

    return this.replaceVariables(fullPrompt, variables);
  }

  public clearCache(): void {
    this.promptCache.clear();
  }
}

export const promptManager = PromptManager.getInstance();