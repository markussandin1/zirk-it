import { NextRequest, NextResponse } from 'next/server'
import { pages } from '@/lib/database'
import { masterOrchestrator } from '@/lib/ai/agents'
import { PageContent as DatabasePageContent, Json } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: 'Slug is required'
      }, { status: 400 })
    }

    // Get existing page to extract original form data
    const existingPage = await pages.getBySlug(slug)
    if (!existingPage) {
      return NextResponse.json({
        success: false,
        error: 'Page not found'
      }, { status: 404 })
    }

    // Extract original form data from metadata
    const metaData = existingPage.meta_data as any
    const originalFormData = metaData?.form_data

    if (!originalFormData) {
      return NextResponse.json({
        success: false,
        error: 'Original form data not found - cannot regenerate'
      }, { status: 400 })
    }

    console.log('=== REGENERATING WEBSITE WITH SAME DATA ===')
    console.log('Original slug:', slug)
    console.log('Business Name:', originalFormData.businessName)
    console.log('Industry:', originalFormData.industry)
    console.log('Services:', originalFormData.services)

    // Use exact same input data as original
    const generationResult = await masterOrchestrator.generateWebsite({
      businessName: originalFormData.businessName,
      industry: originalFormData.industry,
      description: originalFormData.description,
      services: originalFormData.services?.filter((s: string) => s.trim()) || [],
      contactEmail: originalFormData.contactEmail,
      contactPhone: originalFormData.contactPhone,
      contactAddress: originalFormData.contactAddress,
      heroImage: originalFormData.heroImage,
      logoImage: originalFormData.logoImage
    })

    console.log('=== REGENERATION COMPLETED ===')
    console.log('Success:', generationResult.success)
    console.log('Agents completed:', generationResult.context.generationMetadata.completedAgents)
    console.log('Total execution time:', generationResult.context.generationMetadata.totalExecutionTime + 'ms')
    
    if (!generationResult.success) {
      console.error('Regeneration failed:', generationResult.error)
      
      if (generationResult.data) {
        console.log('Using fallback content from orchestrator')
      } else {
        throw new Error(`Regeneration failed: ${generationResult.error}`)
      }
    }

    // Convert agent PageContent to database format
    const agentContent = generationResult.data!
    const content: DatabasePageContent = {
      hero: {
        ...agentContent.hero,
        image: originalFormData.heroImage || undefined
      },
      about: agentContent.about,
      services: {
        title: agentContent.services.title,
        items: agentContent.services.items.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price || undefined
        }))
      },
      contact: {
        title: agentContent.contact.title,
        email: agentContent.contact.email || undefined,
        phone: agentContent.contact.phone || undefined,
        address: agentContent.contact.address || undefined
      },
      branding: originalFormData.logoImage ? {
        logo: originalFormData.logoImage
      } : undefined
    }

    // Create new slug with timestamp to compare versions
    const newSlug = `${slug}-v${Date.now()}`

    // Save new version with regeneration metadata
    const newPage = await pages.create({
      slug: newSlug,
      business_name: originalFormData.businessName,
      industry: originalFormData.industry,
      content: content as unknown as Json,
      meta_data: {
        created_via: 'regeneration-v1',
        original_slug: slug,
        form_data: originalFormData,
        generation: {
          traceId: generationResult.context.generationMetadata.traceId,
          totalTime: generationResult.context.generationMetadata.totalExecutionTime,
          completedAgents: generationResult.context.generationMetadata.completedAgents,
          success: generationResult.success,
          error: generationResult.error || null,
          agentResults: {
            brandContext: generationResult.context.agentResults.brandContext ? {
              confidence: generationResult.context.agentResults.brandContext.confidence,
              tone: generationResult.context.agentResults.brandContext.tone.description,
              targetAudience: generationResult.context.agentResults.brandContext.targetAudience
            } : null,
            qualityAssurance: generationResult.context.agentResults.qualityAssurance ? {
              qualityScore: generationResult.context.agentResults.qualityAssurance.qualityScore,
              enhancementsApplied: generationResult.context.agentResults.qualityAssurance.enhancementsApplied
            } : null
          }
        },
        regenerated_at: new Date().toISOString()
      } as unknown as Json
    })

    if (!newPage) {
      return NextResponse.json({
        success: false,
        error: 'Failed to save regenerated website'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Website regenerated successfully!',
      original_slug: slug,
      new_slug: newPage.slug,
      page_id: newPage.id,
      comparison_urls: {
        original: `/s/${slug}`,
        regenerated: `/s/${newPage.slug}`
      },
      generation: {
        traceId: generationResult.context.generationMetadata.traceId,
        totalTime: generationResult.context.generationMetadata.totalExecutionTime,
        completedAgents: generationResult.context.generationMetadata.completedAgents,
        agentCount: generationResult.context.generationMetadata.completedAgents.length,
        qualityScore: generationResult.context.agentResults.qualityAssurance?.qualityScore || null
      }
    })

  } catch (error) {
    console.error('Error regenerating website:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}