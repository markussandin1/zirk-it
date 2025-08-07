import { NextRequest, NextResponse } from 'next/server'
import { pages, utils } from '@/lib/database'
import { masterOrchestrator } from '@/lib/ai/agents'
import { PageContent as DatabasePageContent, Json } from '@/types/database'
import { jobs } from '@/lib/job-store';
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
    jobs[jobId] = { status: 'generating', progress: 10 };

    // Normalize field names (handle both businessName and companyName)
    const businessName = formData.businessName || (formData as any).companyName
    const contactAddress = formData.contactAddress || (formData as any).location

    // Generate website content using new agent system
    jobs[jobId].progress = 20;
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
    })
    jobs[jobId].progress = 70;

    if (!generationResult.success) {
      throw new Error(`Agent generation failed: ${generationResult.error}`)
    }

    // Convert agent PageContent to database PageContent format
    const agentContent = generationResult.data!
    const content: DatabasePageContent = {
      hero: {
        ...agentContent.hero,
        image: formData.heroImage || undefined
      },
      about: agentContent.about,
      services: {
        title: agentContent.services.title,
        items: agentContent.services.items.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price || undefined, // Convert null to undefined
          icon: item.icon || undefined // Include icons from agents
        }))
      },
      contact: {
        title: agentContent.contact.title,
        email: agentContent.contact.email || undefined,
        phone: agentContent.contact.phone || undefined,
        address: agentContent.contact.address || undefined
      },
      branding: formData.logoImage ? {
        logo: formData.logoImage
      } : undefined,
      // Include design tokens from Creative Director Agent
      designTokens: agentContent.designTokens || undefined
    }

    // Generate unique slug
    const slug = utils.generateSlug(businessName)
    jobs[jobId].progress = 80;

    // Save to database with agent metadata
    const page = await pages.create({
      slug,
      business_name: businessName,
      industry: formData.industry,
      content: content as unknown as Json,
      meta_data: { created_via: 'multi-agent-v1' } as unknown as Json
    })
    jobs[jobId].progress = 90;

    if (!page) {
      throw new Error('Failed to save website');
    }

    jobs[jobId] = {
      status: 'completed',
      progress: 100,
      result: { slug: page.slug, page_id: page.id },
    };

  } catch (error) {
    console.error('Error in runGeneration:', error);
    jobs[jobId] = {
      status: 'error',
      progress: 100,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function POST(request: NextRequest) {
  const jobId = uuidv4();
  try {
    const formData: FormData = await request.json()

    // Validate required fields
    if (!formData.businessName || !formData.industry || !formData.description || !formData.services?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    jobs[jobId] = { status: 'pending', progress: 0 };
    runGeneration(jobId, formData); // Don't await this

    return NextResponse.json({ success: true, jobId });

  } catch (error) {
    console.error('Error generating website:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
