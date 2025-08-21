import { useState, useEffect } from 'react'
import { ChatMessage } from '../components/Chat/MessageBubble'
import { generateWebsite } from '../services/aiService'

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load chat state from localStorage on component mount
  useEffect(() => {
    console.log('useChat: Loading from localStorage...')
    const savedMessages = localStorage.getItem('chatMessages')
    const savedWebsite = localStorage.getItem('generatedWebsite')
    
    console.log('useChat: savedMessages:', savedMessages)
    console.log('useChat: savedWebsite:', savedWebsite)
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        console.log('useChat: Restoring messages:', parsedMessages.length)
        setMessages(parsedMessages)
      } catch (error) {
        console.error('Failed to parse saved messages:', error)
      }
    }
    
    if (savedWebsite) {
      try {
        const parsedWebsite = JSON.parse(savedWebsite)
        console.log('useChat: Restoring website:', parsedWebsite.slug)
        setGeneratedWebsite(parsedWebsite)
      } catch (error) {
        console.error('Failed to parse saved website:', error)
      }
    }
    
    setIsInitialized(true)
  }, [])
  
  // Save messages to localStorage whenever they change (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      console.log('useChat: Saving messages to localStorage:', messages.length)
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages, isInitialized])
  
  // Save generatedWebsite to localStorage whenever it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized && generatedWebsite) {
      console.log('useChat: Saving website to localStorage:', generatedWebsite.slug)
      localStorage.setItem('generatedWebsite', JSON.stringify(generatedWebsite))
    }
  }, [generatedWebsite, isInitialized])

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      type: 'text',
      metadata: { timestamp: new Date().toISOString() }
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Generate website using AI
      const result = await generateWebsite(content)
      
      if (result.success) {
        // Add success message with website info
        const successMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Great! I've created a website for ${result.website.business_name}. The website includes a hero section, about section, services, and contact information - all tailored to your business.`,
          isUser: false,
          type: 'generation',
          metadata: { 
            website: result.website,
            timestamp: new Date().toISOString()
          }
        }
        
        setMessages(prev => [...prev, successMessage])
        setGeneratedWebsite(result.website)
        
        // Add follow-up message
        const followUpMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: "You can now preview your website using the button above, or tell me what you'd like to change about it!",
          isUser: false,
          type: 'text',
          metadata: { timestamp: new Date().toISOString() }
        }
        
        setMessages(prev => [...prev, followUpMessage])
      } else {
        throw new Error(result.error || 'Failed to generate website')
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I'm sorry, I encountered an error while generating your website: ${error.message}. Please try again with a different description.`,
        isUser: false,
        type: 'error',
        metadata: { timestamp: new Date().toISOString() }
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setGeneratedWebsite(null)
    localStorage.removeItem('chatMessages')
    localStorage.removeItem('generatedWebsite')
  }
  
  return {
    messages,
    isLoading,
    sendMessage,
    generatedWebsite,
    clearChat
  }
}