import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatInterface from '../components/Chat/ChatInterface'
import { Sparkles, MessageCircle } from 'lucide-react'

export default function LandingPage() {
  const [searchParams] = useSearchParams()
  const [showChat, setShowChat] = useState(false)
  
  useEffect(() => {
    // Check if we should show chat immediately (from preview "Back to Chat" link)
    if (searchParams.get('chat') === 'true') {
      setShowChat(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {!showChat ? (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="mb-16">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-white rounded-full shadow-lg">
                  <Sparkles className="h-12 w-12 text-indigo-600" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Create Your Business Website
                <br />
                <span className="text-indigo-600">Just by Describing It</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Tell our AI about your business in plain English, and watch it generate a complete, professional website in seconds.
              </p>

              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Creating
              </button>
            </div>

            {/* Examples */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sm text-indigo-600 font-medium mb-2">Restaurant</div>
                <div className="text-gray-800 italic">
                  "I want to create a website for my pizza restaurant in Stockholm called Mario's Pizza"
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sm text-indigo-600 font-medium mb-2">Service Business</div>
                <div className="text-gray-800 italic">
                  "I run a home cleaning service in London and need a professional website"
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-sm text-indigo-600 font-medium mb-2">Retail Store</div>
                <div className="text-gray-800 italic">
                  "I have a vintage clothing boutique in Berlin that needs an online presence"
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Generation</h3>
                <p className="text-gray-600">Complete websites generated in seconds, not days</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Professional Design</h3>
                <p className="text-gray-600">Beautiful, responsive designs tailored to your industry</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Editing</h3>
                <p className="text-gray-600">Make changes through simple conversation</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ChatInterface onBack={() => setShowChat(false)} />
      )}
    </div>
  )
}