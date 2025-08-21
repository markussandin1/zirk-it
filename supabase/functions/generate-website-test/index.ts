import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userMessage } = await req.json();
    
    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: 'User message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating test website for:', userMessage);

    // Mock business analysis based on keywords
    let businessAnalysis = {
      businessName: "Test Business",
      businessType: "other",
      location: "Stockholm",
      industry: "General",
      services: ["Service 1", "Service 2", "Service 3"],
      tone: "professional"
    };

    // Simple keyword detection
    if (userMessage.toLowerCase().includes('pizza') || userMessage.toLowerCase().includes('restaurant')) {
      businessAnalysis = {
        businessName: "Mario's Pizza",
        businessType: "restaurant",
        location: "Stockholm",
        industry: "Food & Dining",
        services: ["Dine-in", "Takeaway", "Delivery"],
        tone: "casual"
      };
    } else if (userMessage.toLowerCase().includes('cleaning')) {
      businessAnalysis = {
        businessName: "CleanPro Services",
        businessType: "service",
        location: "London",
        industry: "Cleaning Services",
        services: ["Home Cleaning", "Office Cleaning", "Deep Cleaning"],
        tone: "professional"
      };
    } else if (userMessage.toLowerCase().includes('boutique') || userMessage.toLowerCase().includes('clothing')) {
      businessAnalysis = {
        businessName: "Vintage Berlin",
        businessType: "retail",
        location: "Berlin",
        industry: "Fashion & Retail",
        services: ["Vintage Clothing", "Accessories", "Personal Styling"],
        tone: "modern"
      };
    }

    // Mock generated content
    const generatedContent = {
      hero: {
        headline: `Welcome to ${businessAnalysis.businessName}`,
        subheadline: `Your trusted partner for quality ${businessAnalysis.industry.toLowerCase()} in ${businessAnalysis.location}`,
        ctaText: "Get Started Today"
      },
      about: `${businessAnalysis.businessName} has been serving ${businessAnalysis.location} with exceptional ${businessAnalysis.industry.toLowerCase()} services. We pride ourselves on quality, reliability, and customer satisfaction.`,
      services: businessAnalysis.services,
      contact: {
        phone: "+46 08 123 4567",
        email: `info@${businessAnalysis.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        address: `123 Main Street, ${businessAnalysis.location}`
      }
    };

    // Create slug for the website
    const slug = businessAnalysis.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const websiteData = {
      slug,
      business_name: businessAnalysis.businessName,
      industry: businessAnalysis.industry,
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
        testMode: true
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
        content: generatedContent,
        note: "This is a test response. Configure OpenAI API key for AI generation."
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