
import { z } from 'zod';

// Base interface for any skill result
export interface SkillResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime: number;
  fallbackUsed: boolean;
}

// Context for workflow execution, ensuring traceability
export interface WorkflowContext {
  traceId: string;
  initialInput: any;
  startTime: number;
  logs: Array<{
    timestamp: number;
    skill: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    data?: any;
  }>;
  results: {
    [key: string]: SkillResult<any>;
  };
}

// Base interface for any skill
export interface ISkill<TInput, TOutput> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  execute(input: TInput, context: WorkflowContext): Promise<SkillResult<TOutput>>;
}

// Central registry for all skills
class SkillRegistry {
  private skills = new Map<string, ISkill<any, any>>();

  register<TInput, TOutput>(skill: ISkill<TInput, TOutput>) {
    if (this.skills.has(skill.name)) {
      console.warn(`Skill "${skill.name}" is already registered. Overwriting.`);
    }
    this.skills.set(skill.name, skill);
  }

  get<TInput, TOutput>(name: string): ISkill<TInput, TOutput> | undefined {
    const skill = this.skills.get(name);
    if (!skill) {
      throw new Error(`Skill "${name}" not found.`);
    }
    return skill;
  }

  list(): ISkill<any, any>[] {
    return Array.from(this.skills.values());
  }
}

export const skillRegistry = new SkillRegistry();
