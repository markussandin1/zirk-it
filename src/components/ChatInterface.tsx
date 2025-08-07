'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Upload, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  metadata?: {
    step?: string
    requiresApproval?: boolean
    previewContent?: any
    uploadType?: 'hero' | 'logo'
    uploadedImage?: {
      url: string
      fileName: string
      type: 'hero' | 'logo'
    }
    websiteUrl?: string
  }
}

interface BusinessData {
  businessName?: string
  industry?: string
  description?: string
  services?: string[]
  contactEmail?: string
  contactPhone?: string
  contactAddress?: string
  heroImage?: string
  logoImage?: string
}

export default function ChatInterface() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hej! Jag heter Zara och hjälper dig skapa en professionell hemsida. För att komma igång - vad heter ditt företag?',
      timestamp: new Date(),
      metadata: { step: 'business_name' }
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [businessData, setBusinessData] = useState<BusinessData>({})
  const [currentStep, setCurrentStep] = useState('business_name')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadType, setUploadType] = useState<'hero' | 'logo' | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: 'user' | 'bot', metadata?: any) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      metadata
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')
    addMessage(userMessage, 'user')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          currentStep,
          businessData,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('Chat result:', result)
        
        // Update business data if provided
        if (result.businessData) {
          console.log('Updating business data with:', result.businessData)
          setBusinessData(prev => {
            const updated = { ...prev, ...result.businessData }
            console.log('New business data state:', updated)
            return updated
          })
        } else {
          console.log('No businessData in result')
        }

        // Update current step
        if (result.nextStep) {
          setCurrentStep(result.nextStep)
        }

        // Add bot response
        addMessage(result.message, 'bot', result.metadata)

        // Handle special actions
        if (result.action === 'request_image_upload') {
          setUploadType(result.uploadType)
        } else if (result.action === 'generate_website') {
          // Use the updated data directly from the result, not state (which might not be updated yet)
          const finalBusinessData = result.businessData 
            ? { ...businessData, ...result.businessData }
            : businessData
          console.log('Triggering website generation with data:', finalBusinessData)
          handleWebsiteGenerationWithData(finalBusinessData)
        }
      } else {
        addMessage('Ursäkta, något gick fel. Kan du upprepa det?', 'bot')
      }
    } catch (error) {
      console.error('Chat error:', error)
      addMessage('Det uppstod ett tekniskt problem. Försök igen.', 'bot')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = async (file: File, type: 'hero' | 'logo') => {
    setIsLoading(true)
    
    // Show user message about uploading
    addMessage(`Laddar upp ${type === 'hero' ? 'huvudbild' : 'logga'}: ${file.name}`, 'user')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        const updatedData = { [type + 'Image']: result.url }
        setBusinessData(prev => ({ ...prev, ...updatedData }))
        
        // Show uploaded image in chat
        addMessage(
          `Perfekt! Jag har laddat upp din ${type === 'hero' ? 'huvudbild' : 'logga'}.`, 
          'bot',
          {
            uploadedImage: {
              type,
              url: result.url,
              fileName: file.name
            }
          }
        )
        
        // Continue conversation based on what's missing
        continueAfterUpload()
      } else {
        addMessage('Kunde inte ladda upp bilden. Försök igen eller hoppa över.', 'bot')
      }
    } catch (error) {
      console.error('Upload error:', error)
      addMessage('Det uppstod ett problem med uppladdningen. Försök igen.', 'bot')
    } finally {
      setIsLoading(false)
      setUploadType(null)
    }
  }

  const continueAfterUpload = () => {
    // Logic to determine next step after image upload
    if (!businessData.heroImage && !businessData.logoImage) {
      addMessage('Vill du ladda upp en logga också?', 'bot', { 
        step: 'logo_upload' 
      })
      setCurrentStep('logo_upload')
    } else {
      // Move to content preview
      generatePreview()
    }
  }

  const generatePreview = async () => {
    addMessage('Låt mig skapa en förhandsvisning av din hemsida...', 'bot')
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData)
      })

      const result = await response.json()

      if (result.success) {
        addMessage(
          'Här är en förhandsvisning av din hemsida. Vad tycker du om texterna?',
          'bot',
          {
            step: 'preview_approval',
            requiresApproval: true,
            previewContent: result.preview
          }
        )
        setCurrentStep('preview_approval')
      } else {
        console.error('Preview generation failed:', result.error, result.details)
        addMessage('Kunde inte skapa förhandsvisning. Ska vi skapa sidan direkt istället?', 'bot')
        // Move to final generation
        setCurrentStep('final_generation')
      }
    } catch (error) {
      console.error('Preview generation error:', error)
      addMessage('Kunde inte skapa förhandsvisning. Ska vi skapa sidan direkt istället?', 'bot')
      setCurrentStep('final_generation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWebsiteGeneration = async () => {
    handleWebsiteGenerationWithData(businessData)
  }

  const handleWebsiteGenerationWithData = async (dataToUse: BusinessData) => {
    setIsGenerating(true)
    addMessage('Perfekt! Nu skapar jag din professionella hemsida...', 'bot')

    console.log('Sending to generate-website API:', dataToUse)
    
    // Validate required fields before sending
    if (!dataToUse.businessName || !dataToUse.industry || !dataToUse.description || !dataToUse.services?.length) {
      console.error('Missing required fields:', {
        businessName: !!dataToUse.businessName,
        industry: !!dataToUse.industry,
        description: !!dataToUse.description,
        services: dataToUse.services?.length || 0
      })
      addMessage('Jag saknar viktig information. Låt oss börja om från början.', 'bot')
      setIsGenerating(false)
      return
    }

    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUse)
      })

      const result = await response.json()

      if (result.success && result.jobId) {
        // Start polling for the result
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/generation-status/${result.jobId}`);
            const statusResult = await statusResponse.json();

            if (statusResult.status === 'completed') {
              clearInterval(pollInterval);
              setIsGenerating(false);
              addMessage(
                `🎉 Din hemsida är klar!`,
                'bot',
                { 
                  step: 'completed',
                  websiteUrl: `/s/${statusResult.result.slug}`,
                  websiteSlug: statusResult.result.slug
                }
              )
              setTimeout(() => {
                router.push(`/s/${statusResult.result.slug}`)
              }, 5000)
            } else if (statusResult.status === 'error') {
              clearInterval(pollInterval);
              setIsGenerating(false);
              addMessage('Något gick fel när jag skapade hemsidan. Ska vi försöka igen?', 'bot')
            }
          } catch (pollError) {
            clearInterval(pollInterval);
            setIsGenerating(false);
            console.error('Polling error:', pollError);
            addMessage('Det uppstod ett tekniskt problem. Försök igen.', 'bot')
          }
        }, 2000);
      } else {
        console.error('Website generation failed:', result)
        const errorMsg = result.error === 'Missing required fields' 
          ? 'Jag saknar viktig information. Låt oss börja om från början.'
          : 'Något gick fel när jag skapade hemsidan. Ska vi försöka igen?'
        addMessage(errorMsg, 'bot')
        setIsGenerating(false)
      }
    } catch (error) {
      console.error('Website generation error:', error)
      addMessage('Det uppstod ett tekniskt problem. Försök igen.', 'bot')
      setIsGenerating(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && uploadType) {
      handleImageUpload(file, uploadType)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`rounded-lg px-4 py-2 ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Preview Content */}
                {message.metadata?.previewContent && (
                  <div className="mt-3 p-3 bg-white rounded border text-gray-800">
                    <h4 className="font-semibold mb-2">Förhandsvisning:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Rubrik:</strong> {message.metadata.previewContent.hero?.title}</p>
                      <p><strong>Beskrivning:</strong> {message.metadata.previewContent.hero?.subtitle}</p>
                    </div>
                  </div>
                )}

                {/* Uploaded Image Display */}
                {message.metadata?.uploadedImage && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center gap-3">
                      <img 
                        src={message.metadata.uploadedImage.url}
                        alt={message.metadata.uploadedImage.fileName}
                        className={`rounded border ${
                          message.metadata.uploadedImage.type === 'hero' 
                            ? 'w-32 h-18 object-cover' 
                            : 'w-16 h-16 object-contain'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-blue-800">
                          {message.metadata.uploadedImage.type === 'hero' ? '🖼️ Huvudbild' : '📷 Logga'}
                        </p>
                        <p className="text-sm text-blue-600 truncate">
                          {message.metadata.uploadedImage.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website Completion */}
                {message.metadata?.step === 'completed' && message.metadata?.websiteUrl && (
                  <div className="mt-3 space-y-3">
                    <div className="p-3 bg-green-50 rounded border border-green-200 text-green-800">
                      <p className="font-semibold mb-2">🌟 Din hemsida finns här:</p>
                      <a 
                        href={message.metadata?.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 bg-white rounded border text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {window.location.origin}{message.metadata?.websiteUrl}
                      </a>
                    </div>
                    <button
                      onClick={() => router.push(message.metadata?.websiteUrl!)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                      Gå till din hemsida →
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      (Du kommer automatiskt att omdirigeras om 5 sekunder)
                    </p>
                  </div>
                )}
                
                <div className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString('sv-SE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex mr-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        {uploadType && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
              Ladda upp {uploadType === 'hero' ? 'en huvudbild' : 'din logga'}:
            </p>
            <div className="flex gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="text-sm flex-1"
              />
              <button
                onClick={() => setUploadType(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Hoppa över
              </button>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isGenerating ? 'Genererar hemsida...' : 'Skriv ditt svar...'}
            disabled={isLoading || isGenerating}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          
          {/* Upload buttons */}
          {!uploadType && !isGenerating && (
            <>
              <button
                onClick={() => setUploadType('hero')}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
                title="Ladda upp huvudbild"
              >
                🖼️
              </button>
              <button
                onClick={() => setUploadType('logo')}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-3 py-2 rounded-lg transition-colors"
                title="Ladda upp logga"
              >
                📷
              </button>
            </>
          )}
          
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim() || isGenerating}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}