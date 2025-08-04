import { supabase, supabaseAdmin } from './supabase'
import type { Page, PageInsert, Feedback, FeedbackInsert } from '@/types/database'

// Pages operations
export const pages = {
  // Get page by slug
  async getBySlug(slug: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching page:', error)
      return null
    }

    return data
  },

  // Create new page
  async create(page: PageInsert): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .insert(page)
      .select()
      .single()

    if (error) {
      console.error('Error creating page:', error)
      return null
    }

    return data
  },

  // Update page
  async update(id: string, updates: Partial<PageInsert>): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating page:', error)
      return null
    }

    return data
  },

  // Get all pages (for admin/analytics)
  async getAll(limit = 50): Promise<Page[]> {
    const { data, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching pages:', error)
      return []
    }

    return data || []
  }
}

// Feedback operations
export const feedback = {
  // Get feedback for a page
  async getByPageId(pageId: string): Promise<Feedback[]> {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching feedback:', error)
      return []
    }

    return data || []
  },

  // Create feedback
  async create(feedbackData: FeedbackInsert): Promise<Feedback | null> {
    const { data, error } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select()
      .single()

    if (error) {
      console.error('Error creating feedback:', error)
      return null
    }

    return data
  },

  // Get average rating for a page
  async getAverageRating(pageId: string): Promise<number> {
    const { data, error } = await supabase
      .from('feedback')
      .select('rating')
      .eq('page_id', pageId)
      .not('rating', 'is', null)

    if (error || !data || data.length === 0) {
      return 0
    }

    const ratings = data.map(f => f.rating).filter(r => r !== null) as number[]
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  }
}

// Utility functions
export const utils = {
  // Generate unique slug
  generateSlug(businessName: string): string {
    const baseSlug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
    
    // Add random suffix to ensure uniqueness
    const suffix = Math.random().toString(36).substring(2, 8)
    return `${baseSlug}-${suffix}`
  },

  // Validate slug format
  isValidSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 60
  }
}