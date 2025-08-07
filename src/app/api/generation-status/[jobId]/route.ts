// src/app/api/generation-status/[jobId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jobs } from '@/lib/job-store';

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  const { jobId } = params;
  const job = jobs[jobId];

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}
