import { NextResponse } from 'next/server'
import { pages } from '@/lib/database'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('pages')
      .select('count', { count: 'exact', head: true })

    if (connectionError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Connection failed', 
        details: connectionError 
      })
    }

    // Test 2: Create a test page
    const testPage = {
      slug: 'test-connection-' + Date.now(),
      business_name: 'Test Business',
      industry: 'Testing',
      content: {
        hero: {
          title: 'Test Page',
          subtitle: 'Database connection test'
        },
        about: {
          title: 'About Test',
          description: 'This is a test page to verify database connectivity.'
        },
        services: {
          title: 'Test Services',
          items: []
        },
        contact: {
          title: 'Contact Test'
        }
      },
      meta_data: {
        test: true,
        created_by: 'api_test'
      }
    }

    const createdPage = await pages.create(testPage)

    if (!createdPage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create test page' 
      })
    }

    // Test 3: Retrieve the created page
    const retrievedPage = await pages.getBySlug(testPage.slug)

    if (!retrievedPage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to retrieve test page' 
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tests: {
        connection: 'OK',
        create: 'OK',
        retrieve: 'OK'
      },
      data: {
        totalPages: connectionTest?.[0]?.count || 0,
        testPage: {
          id: createdPage.id,
          slug: createdPage.slug,
          business_name: createdPage.business_name
        }
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}