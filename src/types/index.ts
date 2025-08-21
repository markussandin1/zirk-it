// Export template types
export * from './templates'

export interface TestConnection {
  id: string
  message: string
  created_at: string
}

// Updated Website interface to match new database schema
export interface Website {
  id: string
  slug: string
  business_name: string
  industry: string | null
  content: WebsiteContent
  meta_data: any | null
  template_id: string
  custom_styles: CustomStyles
  is_published: boolean
  theme_settings: ThemeSettings
  created_at: string
  updated_at: string
}

// Chat system interfaces
export interface ChatSession {
  id: string
  page_id: string
  session_data: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  message: string
  is_user: boolean
  message_type: 'text' | 'generation' | 'edit' | 'confirmation'
  metadata: Record<string, any>
  created_at: string
}

// Import specific types for convenience
import { 
  WebsiteContent, 
  CustomStyles, 
  ThemeSettings
} from './templates'