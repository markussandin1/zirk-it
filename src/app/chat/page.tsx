import ChatInterface from '@/components/ChatInterface'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Website with AI
            </h1>
            <p className="text-lg text-gray-600">
              Tell me about your business and I&apos;ll help you create a professional website in minutes
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Create Website with AI Chat - Zirk.it',
  description: 'Use our AI assistant to create a professional website by simply chatting about your business',
}