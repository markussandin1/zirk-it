// Template configurations for Sub-Iteration 2A
import { WebsiteTemplate, TemplateId, BusinessTypeMapping } from '../types/templates'

export const AVAILABLE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'modern_business',
    name: 'Modern Business',
    description: 'Clean, professional design for general businesses',
    businessTypes: ['consulting', 'agency', 'service', 'technology', 'professional'],
    colorScheme: {
      primary: 'indigo-600',
      secondary: 'purple-600',
      accent: 'blue-500',
      background: 'gray-50',
      text: 'gray-900'
    },
    sections: {
      hero: true,
      about: true,
      services: true,
      contact: true,
      footer: true
    },
    layout: 'single-page'
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    description: 'Warm, inviting design for restaurants and food businesses',
    businessTypes: ['restaurant', 'cafe', 'food', 'catering', 'pizza', 'dining'],
    colorScheme: {
      primary: 'orange-600',
      secondary: 'red-600',
      accent: 'yellow-500',
      background: 'amber-50',
      text: 'gray-900'
    },
    sections: {
      hero: true,
      about: true,
      services: true, // Menu items
      gallery: true,
      contact: true,
      footer: true
    },
    layout: 'single-page'
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    description: 'Product-focused design for retail businesses',
    businessTypes: ['retail', 'shop', 'store', 'ecommerce', 'boutique', 'market'],
    colorScheme: {
      primary: 'green-600',
      secondary: 'emerald-600',
      accent: 'teal-500',
      background: 'green-50',
      text: 'gray-900'
    },
    sections: {
      hero: true,
      about: true,
      services: true, // Products
      gallery: true,
      testimonials: true,
      contact: true,
      footer: true
    },
    layout: 'single-page'
  }
]

// Business type to template mapping for automatic template selection
export const BUSINESS_TYPE_MAPPING: BusinessTypeMapping = {
  // Restaurant & Food
  'restaurant': 'restaurant',
  'cafe': 'restaurant',
  'food': 'restaurant',
  'food service': 'restaurant',
  'catering': 'restaurant',
  'pizza': 'restaurant',
  'dining': 'restaurant',
  'bakery': 'restaurant',
  'bar': 'restaurant',
  'pub': 'restaurant',
  
  // Retail & E-commerce
  'retail': 'retail',
  'shop': 'retail',
  'store': 'retail',
  'ecommerce': 'retail',
  'boutique': 'retail',
  'market': 'retail',
  'clothing': 'retail',
  'vintage clothing': 'retail',
  'fashion': 'retail',
  'jewelry': 'retail',
  'electronics': 'retail',
  
  // Modern Business (default for most other types)
  'consulting': 'modern_business',
  'agency': 'modern_business',
  'service': 'modern_business',
  'technology': 'modern_business',
  'professional': 'modern_business',
  'marketing': 'modern_business',
  'design': 'modern_business',
  'law': 'modern_business',
  'finance': 'modern_business',
  'healthcare': 'modern_business',
  'education': 'modern_business',
  'real estate': 'modern_business',
  'construction': 'modern_business',
  'cleaning': 'modern_business'
}

// Default template for unknown business types
export const DEFAULT_TEMPLATE_ID: TemplateId = 'modern_business'

// Template metadata for analytics and tracking
export interface TemplateMetadata {
  templateId: TemplateId
  usage_count: number
  avg_satisfaction: number
  last_used: string
}

// Color scheme variations for each template
export const TEMPLATE_COLOR_VARIATIONS = {
  modern_business: [
    {
      name: 'Professional Blue',
      primary: 'indigo-600',
      secondary: 'purple-600',
      accent: 'blue-500',
      background: 'gray-50',
      text: 'gray-900'
    },
    {
      name: 'Corporate Navy',
      primary: 'slate-700',
      secondary: 'slate-600',
      accent: 'blue-600',
      background: 'slate-50',
      text: 'slate-900'
    },
    {
      name: 'Tech Green',
      primary: 'emerald-600',
      secondary: 'teal-600',
      accent: 'green-500',
      background: 'emerald-50',
      text: 'gray-900'
    }
  ],
  restaurant: [
    {
      name: 'Warm Orange',
      primary: 'orange-600',
      secondary: 'red-600',
      accent: 'yellow-500',
      background: 'amber-50',
      text: 'gray-900'
    },
    {
      name: 'Rustic Red',
      primary: 'red-700',
      secondary: 'orange-600',
      accent: 'amber-500',
      background: 'red-50',
      text: 'gray-900'
    },
    {
      name: 'Mediterranean',
      primary: 'amber-600',
      secondary: 'orange-500',
      accent: 'yellow-400',
      background: 'amber-50',
      text: 'gray-900'
    }
  ],
  retail: [
    {
      name: 'Fresh Green',
      primary: 'green-600',
      secondary: 'emerald-600',
      accent: 'teal-500',
      background: 'green-50',
      text: 'gray-900'
    },
    {
      name: 'Luxury Purple',
      primary: 'purple-600',
      secondary: 'violet-600',
      accent: 'purple-400',
      background: 'purple-50',
      text: 'gray-900'
    },
    {
      name: 'Modern Pink',
      primary: 'rose-600',
      secondary: 'pink-600',
      accent: 'rose-400',
      background: 'rose-50',
      text: 'gray-900'
    }
  ]
}