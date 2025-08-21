// Template selection utilities for Sub-Iteration 2A
import { 
  TemplateId, 
  WebsiteTemplate, 
  TemplateColorScheme 
} from '../types/templates'
import { 
  AVAILABLE_TEMPLATES, 
  BUSINESS_TYPE_MAPPING, 
  DEFAULT_TEMPLATE_ID,
  TEMPLATE_COLOR_VARIATIONS 
} from '../constants/templates'

/**
 * Select appropriate template based on business type and industry
 */
export function selectTemplateForBusiness(
  businessType?: string, 
  industry?: string
): TemplateId {
  if (!businessType && !industry) {
    return DEFAULT_TEMPLATE_ID
  }

  // First try to match by business type
  if (businessType) {
    const normalizedBusinessType = businessType.toLowerCase().trim()
    
    // Direct match
    if (BUSINESS_TYPE_MAPPING[normalizedBusinessType]) {
      return BUSINESS_TYPE_MAPPING[normalizedBusinessType]
    }
    
    // Partial match - check if business type contains any keywords
    for (const [keyword, templateId] of Object.entries(BUSINESS_TYPE_MAPPING)) {
      if (normalizedBusinessType.includes(keyword) || keyword.includes(normalizedBusinessType)) {
        return templateId
      }
    }
  }

  // Try to match by industry if business type didn't match
  if (industry) {
    const normalizedIndustry = industry.toLowerCase().trim()
    
    if (BUSINESS_TYPE_MAPPING[normalizedIndustry]) {
      return BUSINESS_TYPE_MAPPING[normalizedIndustry]
    }
    
    // Partial match for industry
    for (const [keyword, templateId] of Object.entries(BUSINESS_TYPE_MAPPING)) {
      if (normalizedIndustry.includes(keyword) || keyword.includes(normalizedIndustry)) {
        return templateId
      }
    }
  }

  return DEFAULT_TEMPLATE_ID
}

/**
 * Get template configuration by ID
 */
export function getTemplateById(templateId: TemplateId): WebsiteTemplate | null {
  return AVAILABLE_TEMPLATES.find(template => template.id === templateId) || null
}

/**
 * Get all available templates
 */
export function getAllTemplates(): WebsiteTemplate[] {
  return [...AVAILABLE_TEMPLATES]
}

/**
 * Get templates suitable for specific business types
 */
export function getTemplatesForBusinessType(businessType: string): WebsiteTemplate[] {
  const normalizedBusinessType = businessType.toLowerCase().trim()
  
  return AVAILABLE_TEMPLATES.filter(template => 
    template.businessTypes.some(type => 
      type.includes(normalizedBusinessType) || 
      normalizedBusinessType.includes(type)
    )
  )
}

/**
 * Get color scheme variations for a template
 */
export function getColorVariationsForTemplate(templateId: TemplateId): TemplateColorScheme[] {
  return TEMPLATE_COLOR_VARIATIONS[templateId] || []
}

/**
 * Analyze business description and suggest best template
 */
export function suggestTemplateFromDescription(description: string): {
  templateId: TemplateId
  confidence: number
  reasoning: string
} {
  if (!description) {
    return {
      templateId: DEFAULT_TEMPLATE_ID,
      confidence: 0.5,
      reasoning: 'No description provided, using default template'
    }
  }

  const normalizedDescription = description.toLowerCase()
  let maxScore = 0
  let bestTemplate: TemplateId = DEFAULT_TEMPLATE_ID
  let matchedKeywords: string[] = []

  // Score each template based on keyword matches
  for (const template of AVAILABLE_TEMPLATES) {
    let score = 0
    const keywords: string[] = []

    // Check business type keywords
    for (const businessType of template.businessTypes) {
      if (normalizedDescription.includes(businessType)) {
        score += 2 // High weight for business type matches
        keywords.push(businessType)
      }
    }

    // Additional context keywords for better matching
    const contextKeywords = getContextKeywordsForTemplate(template.id)
    for (const keyword of contextKeywords) {
      if (normalizedDescription.includes(keyword)) {
        score += 1
        keywords.push(keyword)
      }
    }

    if (score > maxScore) {
      maxScore = score
      bestTemplate = template.id as TemplateId
      matchedKeywords = keywords
    }
  }

  const confidence = Math.min(maxScore / 3, 1) // Normalize to 0-1 scale

  return {
    templateId: bestTemplate,
    confidence,
    reasoning: matchedKeywords.length > 0 
      ? `Matched keywords: ${matchedKeywords.join(', ')}`
      : 'No specific keywords matched, using default template'
  }
}

/**
 * Get context keywords for better template matching
 */
function getContextKeywordsForTemplate(templateId: string): string[] {
  const contextMap: Record<string, string[]> = {
    restaurant: [
      'menu', 'food', 'dining', 'kitchen', 'chef', 'cuisine', 'meal', 'cooking',
      'delivery', 'takeout', 'order', 'table', 'reservation', 'taste', 'recipe'
    ],
    retail: [
      'product', 'sell', 'buy', 'shopping', 'store', 'inventory', 'customer',
      'merchandise', 'sales', 'online', 'purchase', 'cart', 'checkout', 'payment'
    ],
    modern_business: [
      'professional', 'service', 'consultation', 'business', 'corporate', 
      'solution', 'expert', 'team', 'client', 'project', 'strategy'
    ]
  }

  return contextMap[templateId] || []
}

/**
 * Validate template configuration
 */
export function validateTemplate(template: WebsiteTemplate): boolean {
  try {
    // Check required fields
    if (!template.id || !template.name || !template.description) {
      return false
    }

    // Check color scheme
    if (!template.colorScheme || 
        !template.colorScheme.primary || 
        !template.colorScheme.secondary) {
      return false
    }

    // Check sections
    if (!template.sections || 
        typeof template.sections.hero !== 'boolean' || 
        typeof template.sections.contact !== 'boolean') {
      return false
    }

    return true
  } catch (error) {
    console.error('Template validation error:', error)
    return false
  }
}

/**
 * Get template statistics for analytics
 */
export function getTemplateStats() {
  return {
    totalTemplates: AVAILABLE_TEMPLATES.length,
    businessTypeCoverage: Object.keys(BUSINESS_TYPE_MAPPING).length,
    templatesByType: AVAILABLE_TEMPLATES.reduce((acc, template) => {
      acc[template.id] = template.businessTypes.length
      return acc
    }, {} as Record<string, number>)
  }
}