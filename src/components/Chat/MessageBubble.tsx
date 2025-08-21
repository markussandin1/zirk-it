import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  type: 'text' | 'generation' | 'success' | 'error'
  metadata?: {
    website?: any
    timestamp?: string
  }
}

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { content, isUser, type, metadata } = message
  const navigate = useNavigate()

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-xs lg:max-w-md px-4 py-2 bg-indigo-600 text-white rounded-lg">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs lg:max-w-2xl">
        {type === 'generation' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
            <div className="flex items-center text-blue-800 font-medium mb-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Website Generated Successfully!
            </div>
            {metadata?.website && (
              <div className="space-y-2">
                <div className="text-sm text-blue-700">
                  <strong>{metadata.website.business_name}</strong>
                </div>
                <div className="text-xs text-blue-600">
                  Industry: {metadata.website.industry}
                </div>
                <button 
                  onClick={() => {
                    console.log('MessageBubble: Setting wasInChat to true')
                    localStorage.setItem('wasInChat', 'true')
                    navigate(`/preview/${metadata.website.slug}?from=chat`)
                  }}
                  className="inline-flex items-center mt-2 px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Website
                </button>
              </div>
            )}
          </div>
        )}
        
        {type === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
            <div className="flex items-center text-red-800 font-medium mb-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              Something went wrong
            </div>
          </div>
        )}
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-800">
          {content}
        </div>
        
        {metadata?.timestamp && (
          <div className="text-xs text-gray-500 mt-1 px-2">
            {new Date(metadata.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}