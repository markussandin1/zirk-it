import { NextRequest, NextResponse } from 'next/server'
import { pages, utils } from '@/lib/database'
import { supabase } from '@/lib/supabase' // Corrected import
import { masterOrchestrator } from '@/lib/ai/agents'
import { PageContent as DatabasePageContent, Json } from '@/types/database'
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  businessName: string
  industry: string
  description: string
  services: string[]
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  heroImage?: string
  logoImage?: string
}

async function runGeneration(jobId: string, formData: FormData) {
  try {
    await supabase.from('jobs').update({ status: 'generating', progress: 10 }).eq('id', jobId);

    const businessName = formData.businessName;
    const contactAddress = formData.contactAddress;

    const generationResult = await masterOrchestrator.generateWebsite({
      businessName,
      industry: formData.industry,
      description: formData.description,
      services: formData.services.filter(s => s.trim()),
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      contactAddress,
      heroImage: formData.heroImage,
      logoImage: formData.logoImage
    });
    await supabase.from('jobs').update({ progress: 70 }).eq('id', jobId);

    if (!generationResult.success) {
      throw new Error(`Agent generation failed: ${generationResult.error}`)
    }

    const agentContent = generationResult.data!;
    const content: DatabasePageContent = {
      hero: { ...agentContent.hero, image: formData.heroImage || undefined },
      about: agentContent.about,
      services: { title: agentContent.services.title, items: agentContent.services.items.map(item => ({ name: item.name, description: item.description, price: item.price || undefined, icon: item.icon || undefined })) },
      contact: { title: agentContent.contact.title, email: agentContent.contact.email || undefined, phone: agentContent.contact.phone || undefined, address: agentContent.contact.address || undefined },
      branding: formData.logoImage ? { logo: formData.logoImage } : undefined,
      designTokens: agentContent.designTokens || undefined
    };

    const slug = utils.generateSlug(businessName);
    await supabase.from('jobs').update({ progress: 80 }).eq('id', jobId);

    const page = await pages.create({
      slug,
      business_name: businessName,
      industry: formData.industry,
      content: content as unknown as Json,
      meta_data: { created_via: 'multi-agent-v1' } as unknown as Json
    });
    await supabase.from('jobs').update({ progress: 90, page_id: page.id }).eq('id', jobId);

    if (!page) {
      throw new Error('Failed to save website');
    }

    await supabase.from('jobs').update({
      status: 'completed',
      progress: 100,
      result: { slug: page.slug, page_id: page.id },
    }).eq('id', jobId);

  } catch (error) {
    console.error('Error in runGeneration:', error);
    await supabase.from('jobs').update({
      status: 'error',
      progress: 100,
      error: error instanceof Error ? error.message : 'Unknown error'
    }).eq('id', jobId);
  }
}

export async function POST(request: NextRequest) {
  const jobId = uuidv4();
  try {
    const formData: FormData = await request.json();

    if (!formData.businessName || !formData.industry || !formData.description || !formData.services?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await supabase.from('jobs').insert({ id: jobId, status: 'pending', progress: 0 });
    runGeneration(jobId, formData); // Don't await this

    return NextResponse.json({ success: true, jobId });

  } catch (error) {
    console.error('Error generating website:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
