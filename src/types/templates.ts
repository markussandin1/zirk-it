// Template system type definitions for Sub-Iteration 2A

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  businessTypes: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  sections: {
    hero: boolean;
    about: boolean;
    services: boolean;
    gallery?: boolean;
    testimonials?: boolean;
    contact: boolean;
    footer: boolean;
  };
  layout: 'single-page' | 'multi-section';
}

export interface TemplateColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateSections {
  hero: boolean;
  about: boolean;
  services: boolean;
  gallery?: boolean;
  testimonials?: boolean;
  contact: boolean;
  footer: boolean;
}

export interface WebsiteContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: string;
  services: string[];
  servicesList: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  gallery?: {
    images: string[];
    captions?: string[];
  };
  testimonials?: {
    quote: string;
    author: string;
    role?: string;
  }[];
}

export interface CustomStyles {
  fonts?: {
    heading?: string;
    body?: string;
  };
  spacing?: {
    section?: string;
    container?: string;
  };
  colors?: Partial<TemplateColorScheme>;
  layout?: {
    maxWidth?: string;
    padding?: string;
  };
}

export interface ThemeSettings {
  templateId: string;
  colorScheme: TemplateColorScheme;
  customStyles: CustomStyles;
  darkMode?: boolean;
}

// Template-specific props interface
export interface TemplateProps {
  website: {
    id: string;
    business_name: string;
    content: WebsiteContent;
    template_id: string;
    theme_settings: ThemeSettings;
    custom_styles: CustomStyles;
  };
  isEditable?: boolean;
  onEdit?: (section: string, field: string) => void;
}

// Available template IDs as const for type safety
export const TEMPLATE_IDS = {
  MODERN_BUSINESS: 'modern_business',
  RESTAURANT: 'restaurant',
  RETAIL: 'retail'
} as const;

export type TemplateId = typeof TEMPLATE_IDS[keyof typeof TEMPLATE_IDS];

// Business type to template mapping
export interface BusinessTypeMapping {
  [businessType: string]: TemplateId;
}