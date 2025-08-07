// src/app/api/generation-status/[jobId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // Ensure the route is always dynamic

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  const { jobId } = params;
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error || !job) {
    // This is expected to happen a few times until the job is created.
    // console.error('Error fetching job status:', error);
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}
