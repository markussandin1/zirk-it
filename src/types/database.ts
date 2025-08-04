export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          slug: string
          business_name: string
          industry: string | null
          content: Json
          meta_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          business_name: string
          industry?: string | null
          content: Json
          meta_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          business_name?: string
          industry?: string | null
          content?: Json
          meta_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          page_id: string | null
          rating: number | null
          comment: string | null
          user_email: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_id?: string | null
          rating?: number | null
          comment?: string | null
          user_email?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string | null
          rating?: number | null
          comment?: string | null
          user_email?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Page = Database['public']['Tables']['pages']['Row']
export type PageInsert = Database['public']['Tables']['pages']['Insert']
export type PageUpdate = Database['public']['Tables']['pages']['Update']

export type Feedback = Database['public']['Tables']['feedback']['Row']
export type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']
export type FeedbackUpdate = Database['public']['Tables']['feedback']['Update']

// Content structure for pages
export interface PageContent {
  hero: {
    title: string
    subtitle: string
    cta_text?: string
  }
  about: {
    title: string
    description: string
  }
  services: {
    title: string
    items: Array<{
      name: string
      description: string
      price?: string
    }>
  }
  contact: {
    title: string
    email?: string
    phone?: string
    address?: string
    hours?: string
  }
}