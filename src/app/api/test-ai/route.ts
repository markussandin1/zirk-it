import { NextResponse } from 'next/server'
import { contentGenerator } from '@/lib/ai/content-generator'

export async function GET() {
  try {
    console.log('Testing AI content generation...')
    
    // First test prompt loading
    const { promptManager } = await import('@/lib/ai/prompt-manager')
    
    console.log('Testing prompt loading...')
    console.log('Current OPENAI_MODEL:', process.env.OPENAI_MODEL)
    console.log('Current OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY?.substring(0, 20))
    
    const systemPrompt = promptManager.getSystemPrompt()
    const restaurantPrompt = promptManager.getIndustryPrompt('restaurant')
    const heroPrompt = promptManager.getSectionPrompt('hero')
    
    console.log('System prompt length:', systemPrompt.length)
    console.log('Restaurant prompt length:', restaurantPrompt.length)
    console.log('Hero prompt length:', heroPrompt.length)
    
    // Test prompt building
    const fullPrompt = promptManager.buildContentPrompt('restaurant', 'hero', {
      businessName: 'Test Coffee Shop',
      industry: 'restaurant',
      description: 'A cozy coffee shop'
    })
    
    console.log('Full prompt built, length:', fullPrompt.length)
    
    const testInput = {
      businessName: 'Test Coffee Shop',
      industry: 'restaurant',
      description: 'A cozy coffee shop serving premium coffee and pastries',
      services: ['Coffee & Tea', 'Fresh Pastries', 'Light Lunch'],
      contactEmail: 'test@coffee.com',
      contactPhone: '+46 123 456 789',
      contactAddress: 'Test Street 123, Stockholm'
    }

    const startTime = Date.now()
    const content = await contentGenerator.generateWebsiteContent(testInput)
    const endTime = Date.now()

    return NextResponse.json({
      success: true,
      message: 'AI content generated successfully',
      generation_time_ms: endTime - startTime,
      content,
      test_input: testInput,
      debug: {
        system_prompt_length: systemPrompt.length,
        restaurant_prompt_length: restaurantPrompt.length,
        hero_prompt_length: heroPrompt.length,
        full_prompt_sample: fullPrompt.substring(0, 200) + '...'
      }
    })

  } catch (error) {
    console.error('AI test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}