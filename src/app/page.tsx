import { GenerationWizard } from '@/components/GenerationWizard';
import HomeMethodSelector from '@/components/HomeMethodSelector'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Zirk.it
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Your business. Connected.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
            Create a professional website for your business in 2 minutes. 
            Just tell us about your business and we&apos;ll build you a beautiful site.
          </p>
          
          <HomeMethodSelector />
        </div>
        
        <div id="form-section">
          <GenerationWizard />
        </div>
      </div>
    </main>
  );
}