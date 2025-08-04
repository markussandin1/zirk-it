import { NextRequest, NextResponse } from 'next/server'
import { pages, utils } from '@/lib/database'
import { PageContent } from '@/types/database'

interface FormData {
  businessName: string
  industry: string
  description: string
  services: string[]
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()

    // Validate required fields
    if (!formData.businessName || !formData.industry || !formData.description || !formData.services?.length) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Generate website content (for now, manual generation - AI in next iteration)
    const content: PageContent = {
      hero: {
        title: formData.businessName,
        subtitle: `Welcome to ${formData.businessName} - ${getIndustryTagline(formData.industry)}`,
        cta_text: 'Get in Touch'
      },
      about: {
        title: `About ${formData.businessName}`,
        description: formData.description
      },
      services: {
        title: 'Our Services',
        items: formData.services.filter(s => s.trim()).map(service => ({
          name: service.trim(),
          description: `Professional ${service.toLowerCase()} services tailored to your needs.`
        }))
      },
      contact: {
        title: 'Contact Us',
        email: formData.contactEmail,
        phone: formData.contactPhone,
        address: formData.contactAddress
      }
    }

    // Generate unique slug
    const slug = utils.generateSlug(formData.businessName)

    // Save to database
    const page = await pages.create({
      slug,
      business_name: formData.businessName,
      industry: formData.industry,
      content,
      meta_data: {
        created_via: 'form',
        form_data: formData,
        created_at: new Date().toISOString()
      }
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
      message: 'Website generated successfully!'
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
    technology: 'Innovation meets excellence',
    other: 'Excellence in everything we do'
  }
  
  return taglines[industry] || taglines.other
}