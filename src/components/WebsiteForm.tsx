'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface FormData {
  businessName: string
  industry: string  
  description: string
  services: string[]
  contactEmail: string
  contactPhone: string
  contactAddress: string
  heroImage?: string
  logoImage?: string
}

export default function WebsiteForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    description: '',
    services: [''],
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    heroImage: undefined,
    logoImage: undefined
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services]
    newServices[index] = value
    setFormData(prev => ({
      ...prev,
      services: newServices
    }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, '']
    }))
  }

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        services: newServices
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate website')
      }

      const result = await response.json()
      
      if (result.success && result.slug) {
        // Redirect to the generated website
        router.push(`/s/${result.slug}`)
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error generating website:', error)
      alert('Failed to generate website. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Tell us about your business
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              id="businessName"
              required
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Acme Coffee Shop"
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              id="industry"
              required
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your industry</option>
              <option value="restaurant">Restaurant & Food</option>
              <option value="retail">Retail & Shopping</option>
              <option value="health">Health & Wellness</option>
              <option value="beauty">Beauty & Personal Care</option>
              <option value="professional">Professional Services</option>
              <option value="fitness">Fitness & Sports</option>
              <option value="education">Education & Training</option>
              <option value="automotive">Automotive</option>
              <option value="home">Home & Garden</option>
              <option value="crafts">Crafts & Trades (snickare, elektriker, målare)</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Business Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what your business does, what makes you special, and who you serve..."
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services/Products *
            </label>
            {formData.services.map((service, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  required
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Service ${index + 1} (e.g. Coffee & Pastries)`}
                />
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addService}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add another service
            </button>
          </div>

          {/* Images */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Images (Optional)</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImageUpload
                type="hero"
                label="Hero Image"
                description="A main image for your website header. Will be used as background or featured image."
                currentImage={formData.heroImage}
                onUpload={(url) => handleInputChange('heroImage', url)}
                onRemove={() => handleInputChange('heroImage', '')}
              />
              
              <ImageUpload
                type="logo"
                label="Logo"
                description="Your business logo. Will be displayed in the header and used for branding."
                currentImage={formData.logoImage}
                onUpload={(url) => handleInputChange('logoImage', url)}
                onRemove={() => handleInputChange('logoImage', '')}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+46 XX XXX XX XX"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="contactAddress"
                value={formData.contactAddress}
                onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address, City"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? 'Creating your website...' : 'Create My Website'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}