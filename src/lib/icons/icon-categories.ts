// AI-accessible icon library organized by categories and use cases
// Icons from Lucide React - consistent, professional, and comprehensive

export interface IconMapping {
  name: string
  description: string
  categories: string[]
  keywords: string[]
}

export const AVAILABLE_ICONS: Record<string, IconMapping> = {
  // Business & Professional
  'Briefcase': { name: 'Briefcase', description: 'Business, consulting, professional services', categories: ['business', 'professional'], keywords: ['business', 'work', 'consulting', 'office'] },
  'Building': { name: 'Building', description: 'Company, office, real estate', categories: ['business', 'professional'], keywords: ['building', 'office', 'company', 'real estate'] },
  'Users': { name: 'Users', description: 'Team, community, customers', categories: ['business', 'social'], keywords: ['team', 'people', 'community', 'customers'] },
  'Target': { name: 'Target', description: 'Goals, marketing, strategy', categories: ['business', 'marketing'], keywords: ['target', 'goal', 'strategy', 'marketing'] },
  'TrendingUp': { name: 'TrendingUp', description: 'Growth, analytics, success', categories: ['business', 'analytics'], keywords: ['growth', 'success', 'analytics', 'trending'] },

  // Food & Restaurant
  'Coffee': { name: 'Coffee', description: 'Coffee shop, beverages', categories: ['restaurant', 'food'], keywords: ['coffee', 'cafe', 'beverage', 'drink'] },
  'ChefHat': { name: 'ChefHat', description: 'Cooking, chef services, bakery', categories: ['restaurant', 'food'], keywords: ['cooking', 'chef', 'bakery', 'food'] },
  'UtensilsCrossed': { name: 'UtensilsCrossed', description: 'Dining, restaurant', categories: ['restaurant', 'food'], keywords: ['dining', 'restaurant', 'food', 'meal'] },
  'Pizza': { name: 'Pizza', description: 'Pizza restaurant, fast food', categories: ['restaurant', 'food'], keywords: ['pizza', 'fast food', 'restaurant'] },
  'Cookie': { name: 'Cookie', description: 'Bakery, sweets, desserts', categories: ['restaurant', 'food'], keywords: ['bakery', 'dessert', 'sweets', 'cookie'] },
  'Wine': { name: 'Wine', description: 'Wine, bar, beverages', categories: ['restaurant', 'food'], keywords: ['wine', 'bar', 'alcohol', 'beverage'] },

  // Health & Wellness
  'Heart': { name: 'Heart', description: 'Health, medical, care', categories: ['health', 'medical'], keywords: ['health', 'medical', 'care', 'heart'] },
  'Stethoscope': { name: 'Stethoscope', description: 'Medical practice, healthcare', categories: ['health', 'medical'], keywords: ['medical', 'doctor', 'healthcare', 'clinic'] },
  'Activity': { name: 'Activity', description: 'Fitness, health monitoring', categories: ['health', 'fitness'], keywords: ['fitness', 'health', 'activity', 'exercise'] },
  'Pill': { name: 'Pill', description: 'Pharmacy, medicine', categories: ['health', 'medical'], keywords: ['pharmacy', 'medicine', 'pill', 'drug'] },

  // Beauty & Personal Care
  'Scissors': { name: 'Scissors', description: 'Hair salon, barbershop', categories: ['beauty', 'personal care'], keywords: ['salon', 'hair', 'barber', 'cut'] },
  'Sparkles': { name: 'Sparkles', description: 'Beauty, spa, wellness', categories: ['beauty', 'spa'], keywords: ['beauty', 'spa', 'wellness', 'sparkle'] },
  'Flower': { name: 'Flower', description: 'Spa, natural beauty, wellness', categories: ['beauty', 'spa', 'wellness'], keywords: ['spa', 'natural', 'flower', 'wellness'] },

  // Fitness & Sports
  'Dumbbell': { name: 'Dumbbell', description: 'Gym, fitness training', categories: ['fitness', 'sports'], keywords: ['gym', 'fitness', 'training', 'exercise'] },
  'Bike': { name: 'Bike', description: 'Cycling, sports, fitness', categories: ['fitness', 'sports'], keywords: ['bike', 'cycling', 'sport', 'fitness'] },
  'Trophy': { name: 'Trophy', description: 'Sports, competition, achievement', categories: ['sports', 'achievement'], keywords: ['trophy', 'sports', 'competition', 'win'] },

  // Technology
  'Monitor': { name: 'Monitor', description: 'IT services, computer repair', categories: ['technology', 'IT'], keywords: ['computer', 'IT', 'tech', 'repair'] },
  'Smartphone': { name: 'Smartphone', description: 'Mobile services, tech support', categories: ['technology', 'mobile'], keywords: ['mobile', 'phone', 'smartphone', 'tech'] },
  'Wifi': { name: 'Wifi', description: 'Internet services, connectivity', categories: ['technology', 'internet'], keywords: ['wifi', 'internet', 'connectivity', 'network'] },
  'Code': { name: 'Code', description: 'Software development, programming', categories: ['technology', 'software'], keywords: ['code', 'programming', 'software', 'development'] },
  'Zap': { name: 'Zap', description: 'Electronics, electrical services', categories: ['technology', 'electrical'], keywords: ['electric', 'electronics', 'power', 'energy'] },

  // Home & Crafts
  'Hammer': { name: 'Hammer', description: 'Construction, handyman, repair', categories: ['crafts', 'construction'], keywords: ['hammer', 'construction', 'repair', 'handyman'] },
  'Wrench': { name: 'Wrench', description: 'Mechanical services, repair', categories: ['crafts', 'mechanical'], keywords: ['wrench', 'repair', 'mechanical', 'fix'] },
  'PaintBucket': { name: 'PaintBucket', description: 'Painting services', categories: ['crafts', 'home'], keywords: ['paint', 'painting', 'decorator', 'home'] },
  'Home': { name: 'Home', description: 'Real estate, home services', categories: ['home', 'real estate'], keywords: ['home', 'house', 'real estate', 'property'] },
  'TreePine': { name: 'TreePine', description: 'Landscaping, gardening', categories: ['home', 'garden'], keywords: ['tree', 'garden', 'landscaping', 'nature'] },
  'Drill': { name: 'Drill', description: 'Construction, drilling services', categories: ['crafts', 'construction'], keywords: ['drill', 'construction', 'tools', 'building'] },

  // Automotive
  'Car': { name: 'Car', description: 'Auto services, car repair', categories: ['automotive'], keywords: ['car', 'auto', 'vehicle', 'repair'] },
  'Truck': { name: 'Truck', description: 'Moving services, logistics', categories: ['automotive', 'logistics'], keywords: ['truck', 'moving', 'transport', 'logistics'] },
  'Fuel': { name: 'Fuel', description: 'Gas station, fuel services', categories: ['automotive'], keywords: ['fuel', 'gas', 'petrol', 'station'] },

  // Retail & Shopping
  'ShoppingBag': { name: 'ShoppingBag', description: 'Retail store, shopping', categories: ['retail', 'shopping'], keywords: ['shopping', 'retail', 'store', 'buy'] },
  'Store': { name: 'Store', description: 'Shop, retail business', categories: ['retail', 'business'], keywords: ['store', 'shop', 'retail', 'business'] },
  'Package': { name: 'Package', description: 'Shipping, delivery, e-commerce', categories: ['retail', 'logistics'], keywords: ['package', 'shipping', 'delivery', 'box'] },
  'CreditCard': { name: 'CreditCard', description: 'Payment, financial services', categories: ['financial', 'payment'], keywords: ['payment', 'card', 'money', 'financial'] },

  // Education
  'BookOpen': { name: 'BookOpen', description: 'Education, learning, courses', categories: ['education'], keywords: ['book', 'education', 'learning', 'study'] },
  'GraduationCap': { name: 'GraduationCap', description: 'Education, graduation, training', categories: ['education'], keywords: ['graduation', 'education', 'training', 'school'] },
  'Lightbulb': { name: 'Lightbulb', description: 'Ideas, innovation, consulting', categories: ['education', 'business'], keywords: ['idea', 'innovation', 'creative', 'consulting'] },

  // Communication & Contact
  'Phone': { name: 'Phone', description: 'Contact, communication', categories: ['contact', 'communication'], keywords: ['phone', 'contact', 'call', 'communication'] },
  'Mail': { name: 'Mail', description: 'Email, correspondence', categories: ['contact', 'communication'], keywords: ['email', 'mail', 'contact', 'message'] },
  'MapPin': { name: 'MapPin', description: 'Location, address', categories: ['contact', 'location'], keywords: ['location', 'address', 'map', 'place'] },
  'Clock': { name: 'Clock', description: 'Hours, timing, schedule', categories: ['time', 'schedule'], keywords: ['time', 'hours', 'schedule', 'clock'] },

  // General Services
  'Shield': { name: 'Shield', description: 'Security, protection, insurance', categories: ['security', 'insurance'], keywords: ['security', 'protection', 'insurance', 'safe'] },
  'Star': { name: 'Star', description: 'Quality, premium, rating', categories: ['quality', 'rating'], keywords: ['star', 'quality', 'premium', 'rating'] },
  'Award': { name: 'Award', description: 'Excellence, certification, quality', categories: ['quality', 'award'], keywords: ['award', 'excellence', 'quality', 'certification'] }
}

// Helper function to get icons by category
export function getIconsByCategory(category: string): IconMapping[] {
  return Object.values(AVAILABLE_ICONS).filter(icon => 
    icon.categories.includes(category.toLowerCase())
  )
}

// Helper function to get icons by keywords
export function getIconsByKeywords(keywords: string[]): IconMapping[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase())
  return Object.values(AVAILABLE_ICONS).filter(icon =>
    icon.keywords.some(keyword => lowerKeywords.includes(keyword))
  )
}

// Get suggested icons for an industry
export function getSuggestedIconsForIndustry(industry: string): string[] {
  const industryMappings: Record<string, string[]> = {
    'restaurant': ['Coffee', 'ChefHat', 'UtensilsCrossed', 'Pizza', 'Cookie', 'Wine'],
    'health': ['Heart', 'Stethoscope', 'Activity', 'Pill'],
    'beauty': ['Scissors', 'Sparkles', 'Flower'],
    'fitness': ['Dumbbell', 'Bike', 'Activity', 'Trophy'],
    'technology': ['Monitor', 'Smartphone', 'Wifi', 'Code', 'Zap'],
    'webbdesign': ['Monitor', 'Code', 'Smartphone', 'Zap', 'Target'],
    'webbutveckling': ['Code', 'Monitor', 'Smartphone', 'Zap'],
    'digital marknadsföring': ['Target', 'TrendingUp', 'Users', 'Wifi'],
    'webbdesign och digital marknadsföring': ['Monitor', 'Code', 'Target', 'TrendingUp', 'Users'],
    'crafts': ['Hammer', 'Wrench', 'PaintBucket', 'Drill'],
    'home': ['Home', 'TreePine', 'PaintBucket', 'Hammer'],
    'automotive': ['Car', 'Truck', 'Fuel'],
    'retail': ['ShoppingBag', 'Store', 'Package', 'CreditCard'],
    'education': ['BookOpen', 'GraduationCap', 'Lightbulb'],
    'professional': ['Briefcase', 'Building', 'Users', 'Target', 'TrendingUp']
  }

  // Try exact match first
  let icons = industryMappings[industry.toLowerCase()]
  
  // If no exact match, try partial matches
  if (!icons) {
    for (const [key, value] of Object.entries(industryMappings)) {
      if (industry.toLowerCase().includes(key) || key.includes(industry.toLowerCase())) {
        icons = value
        break
      }
    }
  }

  return icons || ['Star', 'Award', 'Target']
}