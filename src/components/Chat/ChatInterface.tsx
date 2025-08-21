import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Loader2, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { useChat } from '../../hooks/useChat'

interface ChatInterfaceProps {
  onBack: () => void
}

export default function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { messages, isLoading, sendMessage, generatedWebsite, clearChat } = useChat()
  
  console.log('ChatInterface debug:', {
    hasGeneratedWebsite: !!generatedWebsite,
    websiteSlug: generatedWebsite?.slug,
    messagesCount: messages.length
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      await sendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                AI Website Generator
              </h1>
              <p className="text-sm text-gray-500">
                Describe your business to get started
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <button 
                onClick={clearChat}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Chat
              </button>
            )}
            {generatedWebsite && (
              <button 
                onClick={() => {
                  console.log('Setting wasInChat to true')
                  localStorage.setItem('wasInChat', 'true')
                  navigate(`/preview/${generatedWebsite.slug}?from=chat`)
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Preview Website
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <span className="text-4xl">👋</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                What website do you want to create today?
              </h2>
              <p className="text-gray-600 mb-6">
                Describe your business and I'll generate a complete website for you.
              </p>
              <div className="grid gap-2 max-w-md mx-auto">
                <button
                  className="text-left p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                  onClick={() => setMessage("I want to create a website for my pizza restaurant in Stockholm called Mario's Pizza")}
                >
                  <span className="text-sm text-gray-700">
                    "I want to create a website for my pizza restaurant in Stockholm called Mario's Pizza"
                  </span>
                </button>
                <button
                  className="text-left p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                  onClick={() => setMessage("I run a home cleaning service in London and need a professional website")}
                >
                  <span className="text-sm text-gray-700">
                    "I run a home cleaning service in London and need a professional website"
                  </span>
                </button>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your business..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}