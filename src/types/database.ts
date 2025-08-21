export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          slug: string
          business_name: string
          industry: string | null
          content: any
          meta_data: any | null
          template_id: string
          custom_styles: any
          is_published: boolean
          theme_settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          business_name: string
          industry?: string | null
          content: any
          meta_data?: any | null
          template_id?: string
          custom_styles?: any
          is_published?: boolean
          theme_settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          business_name?: string
          industry?: string | null
          content?: any
          meta_data?: any | null
          template_id?: string
          custom_styles?: any
          is_published?: boolean
          theme_settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          page_id: string
          session_data: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          session_data?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          session_data?: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          message: string
          is_user: boolean
          message_type: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          message: string
          is_user: boolean
          message_type?: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          message?: string
          is_user?: boolean
          message_type?: string
          metadata?: any
          created_at?: string
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
      generate_website: {
        Args: { user_message: string }
        Returns: any
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}