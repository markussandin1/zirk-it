import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ChatRequest {
  message: string
  currentStep: string
  businessData: any
  conversationHistory: any[]
}

export async function POST(request: NextRequest) {
  try {
    const { message, currentStep, businessData, conversationHistory }: ChatRequest = await request.json()

    console.log('=== CHAT ASSISTANT ===')
    console.log('Step:', currentStep)
    console.log('User message:', message)
    console.log('Current business data:', businessData)

    const response = await processChat(message, currentStep, businessData, conversationHistory)

    return NextResponse.json(response)

  } catch (error) {
    console.error('Chat assistant error:', error)
    return NextResponse.json({
      success: false,
      message: 'Ursäkta, något gick fel. Kan du upprepa det?'
    }, { status: 500 })
  }
}

async function processChat(
  userMessage: string, 
  currentStep: string, 
  businessData: any, 
  conversationHistory: any[]
) {
  const chatPrompt = buildChatPrompt(userMessage, currentStep, businessData, conversationHistory)
  
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Du är Zara, en hjälpsam AI-assistent som hjälper småföretag att skapa professionella hemsidor.

Din personlighet:
- Vänlig och entusiastisk
- Professionell men inte formell
- Ställer relevanta följdfrågor
- Uppmuntrar och bekräftar användaren
- Pratar svenska

Ditt mål:
- Samla in all information som behövs för att skapa en hemsida
- Guida användaren genom processen steg för steg
- Vara hjälpsam och tålmodig
- Förklara vad du gör och varför

VIKTIGT: Du MÅSTE alltid returnera businessData med all information du samlar in eller skapar.

Svara ENDAST med ett JSON-objekt med denna struktur:
{
  "success": true,
  "message": "Din vänliga text till användaren",
  "nextStep": "nästa steg i processen",
  "businessData": {
    "businessName": "företagsnamn här",
    "industry": "bransch här", 
    "description": "beskrivning här",
    "services": ["tjänst1", "tjänst2", "tjänst3"],
    "contactEmail": "email om tillgängligt",
    "contactPhone": "telefon om tillgängligt",
    "contactAddress": "adress om tillgängligt"
  },
  "action": "special_action_om_sådan_behövs",
  "metadata": {extra data om behövs}
}`
      },
      {
        role: 'user',
        content: chatPrompt
      }
    ],
    max_completion_tokens: 1000,
    temperature: 0.7
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  try {
    // Clean and parse JSON response
    const cleanedContent = extractJSON(content)
    const result = JSON.parse(cleanedContent)
    
    // Validate response structure
    if (!result.success || !result.message) {
      throw new Error('Invalid response structure')
    }

    return result

  } catch (parseError) {
    console.error('Failed to parse chat response:', content)
    
    // Fallback response
    return {
      success: true,
      message: 'Tack för informationen! Kan du berätta lite mer?',
      nextStep: currentStep,
      businessData: {}
    }
  }
}

function buildChatPrompt(
  userMessage: string, 
  currentStep: string, 
  businessData: any, 
  conversationHistory: any[]
): string {
  const stepInstructions = getStepInstructions(currentStep)
  const missingInfo = getMissingInformation(businessData)
  const availableInfo = getAvailableInformation(businessData)
  
  // Check if user wants to generate website - BUT ONLY IF WE HAVE ALL DATA
  const generateKeywords = [
    'publicera', 'skapa sidan', 'bygg sidan', 'gör klart', 'kör igång', 
    'skapa', 'publicera sidan', 'bygga', 'färdig', 'klart', 'live',
    'ja skicka en länk', 'ja publicera', 'ja bygg', 'kör', 'gå vidare'
  ]
  const userWantsGenerate = generateKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword.toLowerCase())
  )
  const hasRequiredData = missingInfo.length === 0
  const shouldGenerate = userWantsGenerate && hasRequiredData
  
  return `Nuvarande steg: ${currentStep}
Användarens meddelande: "${userMessage}"
Vill generera website: ${shouldGenerate ? 'JA - SÄTT ACTION: generate_website' : 'NEJ'}

${stepInstructions}

TILLGÄNGLIG INFORMATION (du VET om detta):
${availableInfo.length > 0 ? availableInfo.join(', ') : 'Inget samlat än'}

SAKNAS FORTFARANDE:
${missingInfo.length > 0 ? missingInfo.join(', ') : 'All grundläggande info är samlad!'}

Nuvarande företagsdata:
${JSON.stringify(businessData, null, 2)}

Konversationshistorik (senaste meddelanden):
${conversationHistory.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

INSTRUKTIONER:

OM användaren ber dig hitta på/skapa fejkad företagsinformation:
1. Skapa ett komplett påhittat företag med:
   - businessName: Ett kreativt företagsnamn
   - industry: En relevant bransch
   - description: En engagerande beskrivning 
   - services: 3-5 konkreta tjänster
   - Valfritt: kontaktuppgifter
2. Returnera ALL denna data i businessData objektet
3. Sätt action: "generate_website" för att skapa sidan direkt

OM användaren ger riktig företagsinformation:
1. Extrahera och samla informationen i businessData
2. VIKTIGT: Om användaren nämner tjänster/services, extrahera dessa DIREKT som en array av strängar
3. Exempel: "bilreparationer, service, däckbyte" → services: ["Bilreparationer", "Service", "Däckbyte"] 
4. ACCEPTERA grundläggande tjänstebeskrivningar - du behöver INTE be om mer specifik information
5. Fortsätt fråga tills all nödvändig data är samlad
6. Först när allt finns, sätt action: "generate_website"

KRITISKT: Du kan BARA sätta action: "generate_website" om SAKNAS FORTFARANDE visar "All grundläggande info är samlad!"

MÅLET: Fylla businessData komplett innan du skapar webbsidan.`
}

function getStepInstructions(step: string): string {
  const instructions: Record<string, string> = {
    'business_name': 'Samla in företagsnamnet. Be om förtydligande om namnet är otydligt.',
    'industry': 'Identifiera branschen. Om oklart, fråga vilken typ av verksamhet de driver.',
    'description': 'Få en beskrivning av vad företaget gör och vad som gör dem speciella.',
    'services': 'Lista konkreta tjänster/produkter. Be om specifika exempel.',
    'contact_info': 'Samla kontaktuppgifter: email, telefon, adress (alla valfria).',
    'images': 'Föreslå bilduppladdning. Förklara att de kan använda bildknapparna (🖼️ för huvudbild, 📷 för logga) bredvid textfältet. Bilder är valfria.',
    'hero_upload': 'Be om en huvudbild för hemsidan. Hänvisa till 🖼️ knappen.',
    'logo_upload': 'Be om företagets logga. Hänvisa till 📷 knappen.',
    'preview_approval': 'Användaren granskar förhandsvisningen. Hantera godkännande eller förslag på ändringar.',
    'final_generation': 'VIKTIGT: När användaren säger att de vill skapa/publicera sidan, sätt action: "generate_website" omedelbart.',
    'ready_to_generate': 'All grundläggande information är samlad. Fråga om de vill se en förhandsvisning eller skapa sidan direkt. Om de säger skapa/publicera, sätt action: "generate_website".',
    'completed': 'Hemsidan är klar!'
  }
  
  return instructions[step] || 'Fortsätt naturlig konversation och samla in information som saknas.'
}

function getMissingInformation(businessData: any): string[] {
  const missing: string[] = []
  
  if (!businessData.businessName && !businessData.companyName) missing.push('företagsnamn')
  if (!businessData.industry) missing.push('bransch')
  if (!businessData.description) missing.push('beskrivning')
  if (!businessData.services || businessData.services.length === 0) missing.push('tjänster')
  
  return missing
}

function getAvailableInformation(businessData: any): string[] {
  const available: string[] = []
  
  if (businessData.businessName || businessData.companyName) available.push('företagsnamn')
  if (businessData.industry) available.push('bransch')
  if (businessData.description) available.push('beskrivning')
  if (businessData.services?.length > 0) available.push(`${businessData.services.length} tjänster`)
  if (businessData.contactEmail) available.push('e-post')
  if (businessData.contactPhone) available.push('telefon')
  if (businessData.contactAddress || businessData.location) available.push('adress')
  if (businessData.heroImage) available.push('🖼️ huvudbild')
  if (businessData.logoImage) available.push('📷 logga')
  
  return available
}

function extractJSON(content: string): string {
  // Try to find JSON in code blocks first
  const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (jsonMatch) {
    return jsonMatch[1].trim()
  }
  
  // Try to find JSON object directly
  const directJsonMatch = content.match(/\{[\s\S]*\}/)
  if (directJsonMatch) {
    return directJsonMatch[0].trim()
  }
  
  return content.trim()
}