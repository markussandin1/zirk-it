import { NextRequest, NextResponse } from 'next/server'
import { pages, utils } from '@/lib/database'
import { masterOrchestrator } from '@/lib/ai/agents'
import { PageContent as DatabasePageContent, Json } from '@/types/database'

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

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()

    // Normalize field names (handle both businessName and companyName)
    const businessName = formData.businessName || (formData as any).companyName
    const contactAddress = formData.contactAddress || (formData as any).location

    // Validate required fields
    if (!businessName || !formData.industry || !formData.description || !formData.services?.length) {
      console.error('Missing required fields in generate-website:', {
        businessName: !!businessName,
        industry: !!formData.industry,
        description: !!formData.description,
        services: formData.services?.length || 0
      })
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Generate website content using new agent system
    console.log('=== STARTING MULTI-AGENT WEBSITE GENERATION ===')
    console.log('Business Name:', businessName)
    console.log('Industry:', formData.industry)
    console.log('Services:', formData.services)
    
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

    console.log('=== AGENT GENERATION COMPLETED ===')
    console.log('Success:', generationResult.success)
    console.log('Agents completed:', generationResult.context.generationMetadata.completedAgents)
    console.log('Total execution time:', generationResult.context.generationMetadata.totalExecutionTime + 'ms')
    
    if (!generationResult.success) {
      console.error('Agent generation failed:', generationResult.error)
      
      // If we have fallback content, use it
      if (generationResult.data) {
        console.log('Using fallback content from orchestrator')
      } else {
        throw new Error(`Agent generation failed: ${generationResult.error}`)
      }
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

    // Save to database with agent metadata
    const page = await pages.create({
      slug,
      business_name: businessName,
      industry: formData.industry,
      content: content as unknown as Json,
      meta_data: {
        created_via: 'multi-agent-v1',
        form_data: formData,
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
        created_at: new Date().toISOString()
      } as unknown as Json
    })

    if (!page) {
      return NextResponse.json({
        success: false,
        error: 'Failed to save website'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      slug: page.slug,
      page_id: page.id,
      message: 'Website generated successfully using multi-agent system!',
      generation: {
        traceId: generationResult.context.generationMetadata.traceId,
        totalTime: generationResult.context.generationMetadata.totalExecutionTime,
        completedAgents: generationResult.context.generationMetadata.completedAgents,
        agentCount: generationResult.context.generationMetadata.completedAgents.length,
        qualityScore: generationResult.context.agentResults.qualityAssurance?.qualityScore || null
      }
    })

  } catch (error) {
    console.error('Error generating website:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

function getIndustryTagline(industry: string): string {
  const taglines: Record<string, string> = {
    restaurant: 'Delicious food, exceptional service',
    retail: 'Quality products, great prices',
    health: 'Your health, our priority',
    beauty: 'Look and feel your best',
    professional: 'Expert solutions for your needs',
    fitness: 'Achieve your fitness goals',
    education: 'Learn, grow, succeed',
    automotive: 'Reliable service you can trust',
    home: 'Making your house a home',
    crafts: 'Quality craftsmanship, reliable service',
    technology: 'Innovation meets excellence',
    other: 'Excellence in everything we do'
  }
  
  return taglines[industry] || taglines.other
}