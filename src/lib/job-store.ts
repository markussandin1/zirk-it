// src/lib/job-store.ts
export interface Job {
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  result?: { slug: string; page_id: string; };
  error?: string;
}

export const jobs: Record<string, Job> = {};
