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
    
    const debugInfo = {
      step: 'started',
      userMessage: userMessage?.substring(0, 50) + '...',
      hasApiKey: !!apiKey,
      keyLength: apiKey?.length
    };

    try {
      debugInfo.step = 'calling_openai';
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
              content: `Analyze this business description and extract structured information: "${userMessage}". Return JSON with: {"businessName": "extracted business name", "businessType": "restaurant|retail|service|other", "location": "city, country if mentioned", "industry": "specific industry category", "services": ["list", "of", "services"], "tone": "professional|casual|modern|traditional"}`
            }
          ],
          temperature: 0.3,
        }),
      });

      debugInfo.step = 'openai_responded';
      debugInfo.openaiStatus = response.status;
      debugInfo.openaiOk = response.ok;

      if (!response.ok) {
        const errorText = await response.text();
        debugInfo.openaiError = errorText;
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      debugInfo.step = 'parsing_response';
      debugInfo.openaiResponse = result.choices[0].message.content.substring(0, 200) + '...';

      let content = result.choices[0].message.content;
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      debugInfo.step = 'parsing_json';
      debugInfo.cleanedContent = content.substring(0, 200) + '...';
      
      const parsed = JSON.parse(content);
      debugInfo.step = 'success';
      debugInfo.parsedBusinessName = parsed.businessName;

      return new Response(JSON.stringify({
        success: true,
        debug: debugInfo,
        parsed: parsed
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      debugInfo.step = 'error';
      debugInfo.error = error.message;
      debugInfo.errorStack = error.stack;

      return new Response(JSON.stringify({
        success: false,
        debug: debugInfo,
        error: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (outerError) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to parse request: ' + outerError.message,
      stack: outerError.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});