import { supabase } from '../lib/supabase'
import { AIGenerationError, NetworkError, handleError } from '../utils/errorHandling'

interface GenerateWebsiteResponse {
  success: boolean
  website?: any
  analysis?: any
  content?: any
  error?: string
}

export const generateWebsite = async (userMessage: string): Promise<GenerateWebsiteResponse> => {
  // Validate input
  if (!userMessage || userMessage.trim().length < 10) {
    return {
      success: false,
      error: 'Please provide a more detailed description of your business (at least 10 characters).'
    }
  }

  try {
    // Get OpenAI API key from environment
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
    
    const { data, error } = await supabase.functions.invoke('generate-website', {
      body: { 
        userMessage: userMessage.trim(),
        apiKey: apiKey // Send API key in request body
      }
    })

    if (error) {
      console.error('Supabase function error:', error)
      
      // Check for specific error types
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new NetworkError('Failed to connect to AI service')
      }
      
      throw new AIGenerationError(error.message || 'Failed to generate website')
    }

    if (!data) {
      throw new AIGenerationError('No response from AI service')
    }

    console.log('AI Generation response:', data);

    if (!data.success) {
      throw new AIGenerationError(data.error || 'Website generation failed')
    }

    return {
      success: true,
      website: data.website,
      analysis: data.analysis,
      content: data.content
    }
  } catch (error: any) {
    console.error('AI service error:', error)
    
    return {
      success: false,
      error: handleError(error)
    }
  }
}