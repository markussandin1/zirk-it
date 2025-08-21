import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userMessage, apiKey } = await req.json();
    
    console.log('=== API KEY TEST ===');
    console.log('Received userMessage:', userMessage);
    console.log('Received apiKey exists:', !!apiKey);
    console.log('ApiKey length:', apiKey?.length);
    console.log('ApiKey starts with:', apiKey?.substring(0, 10));
    
    // Check environment variables
    const envKeys = Object.keys(Deno.env.toObject());
    console.log('All env vars:', envKeys);
    
    const openaiEnvKey = Deno.env.get('OPENAI_API_KEY');
    console.log('OPENAI_API_KEY from env exists:', !!openaiEnvKey);
    console.log('OPENAI_API_KEY length:', openaiEnvKey?.length);
    
    return new Response(JSON.stringify({
      success: true,
      test: 'API key test completed',
      hasApiKeyFromRequest: !!apiKey,
      apiKeyLength: apiKey?.length,
      hasApiKeyFromEnv: !!openaiEnvKey,
      envApiKeyLength: openaiEnvKey?.length,
      availableEnvVars: envKeys
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Test error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});