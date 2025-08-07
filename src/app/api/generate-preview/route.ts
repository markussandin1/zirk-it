import { NextRequest, NextResponse } from 'next/server'
import { masterOrchestrator } from '@/lib/ai/agents'

export async function POST(request: NextRequest) {
  try {
    const businessData = await request.json()

    console.log('=== GENERATING PREVIEW ===')
    console.log('Business data:', businessData)

    // Normalize field names (handle both businessName and companyName)
    const businessName = businessData.businessName || businessData.companyName
    const contactAddress = businessData.contactAddress || businessData.location

    // Validate required fields
    if (!businessName || !businessData.industry || !businessData.description) {
      console.error('Missing required fields:', {
        businessName: !!businessName,
        industry: !!businessData.industry, 
        description: !!businessData.description
      })
      return NextResponse.json({
        success: false,
        error: 'Missing required business information',
        details: {
          businessName: !businessName ? 'missing' : 'ok',
          industry: !businessData.industry ? 'missing' : 'ok',
          description: !businessData.description ? 'missing' : 'ok'
        }
      }, { status: 400 })
    }

    // Ensure services is an array
    const services = Array.isArray(businessData.services) 
      ? businessData.services 
      : businessData.services 
        ? [businessData.services] 
        : []

    console.log('Processed data for agent:', {
      businessName,
      industry: businessData.industry,
      services: services.length,
      hasDescription: !!businessData.description
    })

    // Generate content using existing agent system
    const generationResult = await masterOrchestrator.generateWebsite({
      businessName,
      industry: businessData.industry,
      description: businessData.description,
      services: services.filter((s: any) => s && s.trim()),
      contactEmail: businessData.contactEmail,
      contactPhone: businessData.contactPhone,
      contactAddress,
      heroImage: businessData.heroImage,
      logoImage: businessData.logoImage
    })

    if (!generationResult.success || !generationResult.data) {
      console.error('Preview generation failed:', generationResult.error)
      return NextResponse.json({
        success: false,
        error: 'Failed to generate preview content'
      }, { status: 500 })
    }

    // Return preview content
    const preview = {
      hero: {
        title: generationResult.data.hero.title,
        subtitle: generationResult.data.hero.subtitle,
        cta_text: generationResult.data.hero.cta_text
      },
      about: {
        title: generationResult.data.about.title,
        description: generationResult.data.about.description.substring(0, 200) + '...'
      },
      services: {
        title: generationResult.data.services.title,
        count: generationResult.data.services.items.length,
        sample: generationResult.data.services.items.slice(0, 2).map(item => ({
          name: item.name,
          description: item.description.substring(0, 100) + '...'
        }))
      }
    }

    console.log('Preview generated successfully')

    return NextResponse.json({
      success: true,
      preview,
      generationMetadata: {
        traceId: generationResult.context.generationMetadata.traceId,
        completedAgents: generationResult.context.generationMetadata.completedAgents,
        executionTime: generationResult.context.generationMetadata.totalExecutionTime
      }
    })

  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}