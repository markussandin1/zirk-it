'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface DevToolsProps {
  slug: string
}

export default function DevTools({ slug }: DevToolsProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showResult, setShowResult] = useState<{
    success: boolean
    newSlug?: string
    originalUrl?: string
    regeneratedUrl?: string
    message?: string
  } | null>(null)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    setShowResult(null)

    try {
      const response = await fetch('/api/regenerate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug })
      })

      const result = await response.json()

      if (result.success) {
        setShowResult({
          success: true,
          newSlug: result.new_slug,
          originalUrl: result.comparison_urls.original,
          regeneratedUrl: result.comparison_urls.regenerated,
          message: result.message
        })
      } else {
        setShowResult({
          success: false,
          message: result.error
        })
      }
    } catch (error) {
      setShowResult({
        success: false,
        message: 'Network error occurred'
      })
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <>
      {/* Regenerate Button - Bottom Right Corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className={`
            bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg
            transition-all duration-200 flex items-center gap-2
            ${isRegenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          title="Regenerate with same data (Dev Only)"
        >
          <RefreshCw 
            className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} 
          />
          {isRegenerating && (
            <span className="text-sm font-medium">Regenerating...</span>
          )}
        </button>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {showResult.success ? '✅ Regenerated!' : '❌ Error'}
              </h3>
              <button
                onClick={() => setShowResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">{showResult.message}</p>

              {showResult.success && showResult.originalUrl && showResult.regeneratedUrl && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <a
                      href={showResult.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm text-center transition-colors"
                    >
                      View Original
                    </a>
                    <a
                      href={showResult.regeneratedUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded text-sm text-center transition-colors"
                    >
                      View New Version
                    </a>
                  </div>
                  
                  {showResult.newSlug && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                      <strong>New Slug:</strong> {showResult.newSlug}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowResult(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm transition-colors mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}