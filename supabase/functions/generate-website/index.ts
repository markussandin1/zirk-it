import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { AVAILABLE_TEMPLATES, getTemplatePromptInfo, selectTemplateForBusiness } from '../_shared/templateUtils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BusinessAnalysis {
  businessName: string;
  businessType: 'restaurant' | 'retail' | 'service' | 'other';
  location: string;
  industry: string;
  services: string[];
  tone: 'professional' | 'casual' | 'modern' | 'traditional';
  recommendedTemplate: string;
}

interface GeneratedContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: string;
  services: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userMessage, apiKey } = await req.json();
    
    console.log('Received request:', { 
      userMessage: userMessage?.substring(0, 50) + '...', 
      hasApiKey: !!apiKey 
    });
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'User message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to get API key from environment or request body
    const openaiApiKey = apiKey || 
                         Deno.env.get('OPENAI_API_KEY') || 
                         Deno.env.get('OPENAI_KEY') || 
                         Deno.env.get('VITE_OPENAI_API_KEY');
    
    console.log('API Key check:', { 
      fromRequest: !!apiKey, 
      fromEnv: !!Deno.env.get('OPENAI_API_KEY'),
      hasKey: !!openaiApiKey,
      keyLength: openaiApiKey?.length 
    });
    
    if (!openaiApiKey) {
      console.error('Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured. Please provide apiKey in request body or set OPENAI_API_KEY in Supabase Edge Function secrets.',
          availableEnvVars: Object.keys(Deno.env.toObject()).filter(key => 
            key.toLowerCase().includes('openai') || key.toLowerCase().includes('api')
          )
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Analyze business description
    const businessAnalysisPrompt = `
    Analyze this business description and extract structured information:
    "${userMessage}"

    ${getTemplatePromptInfo()}

    Based on the business description, choose the most appropriate template and return JSON with:
    {
      "businessName": "extracted business name",
      "businessType": "restaurant|retail|service|other",
      "location": "city, country if mentioned",
      "industry": "specific industry category",
      "services": ["list", "of", "services"],
      "tone": "professional|casual|modern|traditional",
      "recommendedTemplate": "template_id_from_above_options"
    }
    
    IMPORTANT: Choose recommendedTemplate carefully based on the business type and industry. 
    - Use "restaurant" for food/dining businesses
    - Use "retail" for shops/stores/boutiques
    - Use "modern_business" for services/consulting/professional businesses
    `;

    console.log('Sending business analysis request to OpenAI...');
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst. Extract business information and return ONLY valid JSON without any markdown formatting or explanation.'
          },
          {
            role: 'user',
            content: businessAnalysisPrompt
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI API error:', analysisResponse.status, errorText);
      throw new Error(`OpenAI API error: ${analysisResponse.status} - ${errorText}`);
    }

    const analysisResult = await analysisResponse.json();
    console.log('OpenAI analysis response:', analysisResult.choices[0].message.content);
    
    let businessAnalysis: BusinessAnalysis;
    try {
      let content = analysisResult.choices[0].message.content;
      // Remove markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      businessAnalysis = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse business analysis JSON:', error);
      console.error('Raw content:', analysisResult.choices[0].message.content);
      throw new Error('Invalid JSON response from OpenAI for business analysis');
    }

    // Step 2: Generate website content
    const contentGenerationPrompt = `
    IMPORTANT: The user said: "${userMessage}"
    
    You MUST follow any specific instructions the user gave about content, headlines, tone, or format.
    
    Generate website content for this business:
    Business: ${businessAnalysis.businessName}
    Type: ${businessAnalysis.businessType}
    Location: ${businessAnalysis.location}
    Industry: ${businessAnalysis.industry}

    RULES FOR CONTENT GENERATION:
    1. If user specified headline format (like "only use company name"), follow it exactly
    2. Don't add marketing slogans unless user asks for them
    3. Keep content minimal and professional unless user requests otherwise
    4. Use ONLY the information provided by the user - don't make assumptions
    5. If user wants simple content, make it simple

    Create JSON with sections:
    {
      "hero": {
        "headline": "Follow user's headline instructions if any, otherwise just company name",
        "subheadline": "Simple description based on user input, no marketing fluff",
        "ctaText": "Simple call to action"
      },
      "about": "Brief description based ONLY on what user provided (1-2 sentences max)",
      "services": ["Only services mentioned by user"],
      "contact": {
        "phone": "+46 (0)XX XXX XX XX",
        "email": "info@${businessAnalysis.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com",
        "address": "Stockholm, Sweden"
      }
    }
    `;

    const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional copywriter. STRICTLY follow user instructions about content format, headlines, and tone. Avoid marketing fluff unless specifically requested. Generate ONLY the content the user asks for and return ONLY valid JSON without any markdown formatting or explanation.'
          },
          {
            role: 'user',
            content: contentGenerationPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error('OpenAI API error (content):', contentResponse.status, errorText);
      throw new Error(`OpenAI API error: ${contentResponse.status} - ${errorText}`);
    }

    const contentResult = await contentResponse.json();
    console.log('OpenAI content response:', contentResult.choices[0].message.content);
    
    let generatedContent: GeneratedContent;
    try {
      let content = contentResult.choices[0].message.content;
      // Remove markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedContent = JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse content generation JSON:', error);
      console.error('Raw content:', contentResult.choices[0].message.content);
      throw new Error('Invalid JSON response from OpenAI for content generation');
    }

    // Step 3: Create slug for the website
    const baseSlug = businessAnalysis.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Add timestamp to make slug unique
    const slug = `${baseSlug}-${Date.now()}`;

    // Step 4: Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Determine template - use AI recommendation with fallback
    const selectedTemplate = businessAnalysis.recommendedTemplate || 
                             selectTemplateForBusiness(businessAnalysis.businessType, businessAnalysis.industry);

    console.log('Template selection:', {
      aiRecommended: businessAnalysis.recommendedTemplate,
      fallbackSelected: selectTemplateForBusiness(businessAnalysis.businessType, businessAnalysis.industry),
      final: selectedTemplate,
      businessType: businessAnalysis.businessType,
      industry: businessAnalysis.industry
    });

    const websiteData = {
      slug,
      business_name: businessAnalysis.businessName,
      industry: businessAnalysis.industry,
      template_id: selectedTemplate,
      content: {
        businessType: businessAnalysis.businessType,
        location: businessAnalysis.location,
        tone: businessAnalysis.tone,
        services: businessAnalysis.services,
        hero: generatedContent.hero,
        about: generatedContent.about,
        servicesList: generatedContent.services,
        contact: generatedContent.contact
      },
      meta_data: {
        userMessage,
        generatedAt: new Date().toISOString(),
        templateReasoning: `AI recommended: ${businessAnalysis.recommendedTemplate}, Final: ${selectedTemplate}`
      }
    };

    const { data: website, error: dbError } = await supabase
      .from('pages')
      .insert([websiteData])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save website', details: dbError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        website,
        analysis: businessAnalysis,
        content: generatedContent
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});