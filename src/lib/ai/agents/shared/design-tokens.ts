// Design tokens interface for Creative Director Agent output
// These tokens drive dynamic styling across generated websites

export interface DesignTokens {
  // Color system based on brand personality and industry
  colorPalette: {
    primary: string      // Main brand color - for CTAs, headers
    secondary: string    // Supporting color - for accents, highlights  
    accent: string       // Pop color - for important elements
    neutral: {
      light: string      // Light backgrounds, cards
      medium: string     // Text on light backgrounds
      dark: string       // Dark text, footers
    }
  }
  
  // Typography system matching brand tone
  typography: {
    headingFont: string  // For h1, h2, hero titles
    bodyFont: string     // For paragraphs, descriptions
    fontScale: {
      hero: string       // Hero section sizing
      heading: string    // Section headings
      body: string       // Body text
      small: string      // Captions, metadata
    }
  }
  
  // Layout and visual style
  layoutStyle: 'corporate' | 'warm' | 'creative' | 'minimal' | 'modern'
  
  // Component styling preferences
  components: {
    cardStyle: 'rounded' | 'sharp' | 'organic'
    buttonStyle: 'solid' | 'outline' | 'minimal'
    shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong'
  }
  
  // Spacing and proportions
  spacing: {
    sectionPadding: string    // Padding between major sections
    cardPadding: string       // Internal card padding
    elementGap: string        // Gap between elements
  }
}

// Industry-specific design preferences
export interface IndustryDesignGuide {
  preferredColors: string[]
  avoidColors: string[]
  typographyStyle: 'serif' | 'sans-serif' | 'mixed'
  layoutPreference: DesignTokens['layoutStyle']
  componentPreferences: {
    formality: 'formal' | 'casual' | 'mixed'
    visualWeight: 'light' | 'medium' | 'bold'
  }
}

// Personality-to-design mapping
export interface PersonalityDesignMapping {
  [personality: string]: {
    colors: string[]
    typography: 'serif' | 'sans-serif' | 'mixed'
    layout: DesignTokens['layoutStyle']
    components: Partial<DesignTokens['components']>
  }
}

// Creative Director output with reasoning
export interface CreativeDirectorOutput extends DesignTokens {
  designReasoning: string        // Why these choices were made
  industryAlignment: string      // How design matches industry
  brandAlignment: string         // How design matches brand personality
  executionTime: number         // Performance tracking
  confidence: number            // 0-1 confidence in design choices
}