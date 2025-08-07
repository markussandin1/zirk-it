'use client'

import Link from 'next/link'

export default function HomeMethodSelector() {
  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">💬 Chat with AI</h3>
        <p className="text-sm text-gray-600 mb-3">Have a conversation with our AI assistant</p>
        <Link 
          href="/chat"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-block transition-colors"
        >
          Start Chat
        </Link>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">📝 Fill Form</h3>
        <p className="text-sm text-gray-600 mb-3">Complete a structured form below</p>
        <button 
          onClick={scrollToForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Use Form
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">🔗 Connect Facebook</h3>
        <p className="text-sm text-gray-600 mb-3">Import info from your Facebook Page</p>
        <a 
          href="/api/auth/login/facebook"
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg inline-block transition-colors"
        >
          Connect
        </a>
      </div>
    </div>
  )
}