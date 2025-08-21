// Template utilities for AI website generation
// This file defines available templates and helps AI select the right one

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  businessTypes: string[];
  bestFor: string;
  features: string[];
}

export const AVAILABLE_TEMPLATES: TemplateInfo[] = [
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    description: 'Warm, inviting design perfect for restaurants, cafes, and food businesses',
    businessTypes: ['restaurant', 'cafe', 'food', 'catering', 'pizza', 'dining', 'bakery', 'bar', 'pub'],
    bestFor: 'Food service businesses that want to showcase their atmosphere and menu',
    features: ['Menu showcase', 'Gallery for food photos', 'Special offers section', 'Warm color scheme', 'Reservation features']
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    description: 'Product-focused design ideal for stores, boutiques, and online shops',
    businessTypes: ['retail', 'shop', 'store', 'boutique', 'market', 'clothing', 'fashion', 'jewelry', 'electronics', 'vintage clothing'],
    bestFor: 'Businesses that sell products and want to highlight their offerings',
    features: ['Product showcases', 'Trust indicators', 'Customer testimonials', 'Newsletter signup', 'Shopping-focused design']
  },
  {
    id: 'modern_business',
    name: 'Modern Business',
    description: 'Clean, professional design for service-based businesses and consultancies',
    businessTypes: ['consulting', 'agency', 'service', 'technology', 'professional', 'marketing', 'design', 'law', 'finance', 'healthcare', 'education', 'real estate', 'construction', 'cleaning'],
    bestFor: 'Professional service businesses that want to establish trust and expertise',
    features: ['Professional layout', 'Service highlights', 'Business hours', 'Contact forms', 'Consultation booking']
  }
];

export function getTemplatePromptInfo(): string {
  return `
Available website templates:

${AVAILABLE_TEMPLATES.map(template => `
**${template.name} (${template.id})**
- Best for: ${template.bestFor}
- Business types: ${template.businessTypes.join(', ')}
- Features: ${template.features.join(', ')}
`).join('\n')}

Choose the most appropriate template based on the business type and industry.`;
}

export function selectTemplateForBusiness(businessType: string, industry: string): string {
  const searchTerms = [businessType, industry].filter(Boolean).map(term => term.toLowerCase());
  
  for (const template of AVAILABLE_TEMPLATES) {
    for (const term of searchTerms) {
      // Check for exact or partial matches
      if (template.businessTypes.some(type => 
        type === term || 
        term.includes(type) || 
        type.includes(term)
      )) {
        return template.id;
      }
    }
  }
  
  // Default fallback
  return 'modern_business';
}