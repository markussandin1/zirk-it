# AI Website Generator - Iteration 2 Implementation Plan

## Current Status Assessment

**Completed in Iteration 1:**
- Basic React app with TypeScript, Tailwind CSS, and shadcn/ui
- Supabase integration with `pages` table (`business_name`, `slug`, `content`, etc.)
- AI website generation via OpenAI API through Supabase Edge Functions
- Basic chat interface for website generation
- Website preview page with responsive design
- Chat history persistence (fixed)
- Basic routing structure (`/` and `/preview/:slug`)

**Current Database Schema:**
- `pages` table: Stores generated websites
- `feedback` table: User feedback system
- Edge function: `generate_website` for AI generation

## Iteration 2 Goals Breakdown

Transform the current basic preview system into a comprehensive website display and editing platform with:
1. Professional responsive templates for different business types
2. Enhanced chat editing capabilities for generated content
3. Website sharing functionality
4. Template system architecture
5. Improved routing and navigation

---

## Sub-Iteration 2A: Database Schema Enhancement & Template System Foundation
**Timeline: 1-2 days**
**Dependencies: None (can start immediately)**

### Goals
- Extend database schema to support templates and improved content structure
- Create template system architecture
- Update TypeScript types
- Migrate existing data structure if needed

### Database Changes Required

```sql
-- Add new columns to pages table for template system
ALTER TABLE pages ADD COLUMN template_id TEXT DEFAULT 'modern_business';
ALTER TABLE pages ADD COLUMN custom_styles JSONB DEFAULT '{}';
ALTER TABLE pages ADD COLUMN is_published BOOLEAN DEFAULT false;
ALTER TABLE pages ADD COLUMN theme_settings JSONB DEFAULT '{}';

-- Create chat_sessions table for better chat management
CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    session_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table for persistent chat history
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    message_type TEXT DEFAULT 'text', -- 'text', 'generation', 'edit', 'confirmation'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_chat_sessions_page_id ON chat_sessions(page_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_pages_template_id ON pages(template_id);

-- Add update trigger for chat_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Files to Create/Update

#### Updated Type Definitions
- **Update:** `/src/types/database.ts` - Add new table definitions
- **Update:** `/src/types/index.ts` - Add template and chat types

#### Template System Foundation
- **Create:** `/src/types/templates.ts` - Template interface definitions
- **Create:** `/src/utils/templateSelector.ts` - Business type to template mapping
- **Create:** `/src/constants/templates.ts` - Template configurations

### Template System Architecture

```typescript
// src/types/templates.ts
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

// Template definitions
export const AVAILABLE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'modern_business',
    name: 'Modern Business',
    description: 'Clean, professional design for general businesses',
    businessTypes: ['consulting', 'agency', 'service', 'technology'],
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
    businessTypes: ['restaurant', 'cafe', 'food', 'catering'],
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
    businessTypes: ['retail', 'shop', 'store', 'ecommerce'],
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
];
```

### Success Criteria
- [ ] Database schema updated successfully
- [ ] New TypeScript types defined and integrated
- [ ] Template system foundation in place
- [ ] Existing websites still work with default template
- [ ] No breaking changes to current functionality

---

## Sub-Iteration 2B: Template Components & Website Renderer
**Timeline: 2-3 days**
**Dependencies: 2A completed**

### Goals
- Build reusable template components for different business types
- Create main WebsiteRenderer component
- Implement template-specific layouts and styling
- Update WebsitePreview to use new template system

### Files to Create

#### Template Components Architecture
- **Create:** `/src/components/Website/WebsiteRenderer.tsx` - Main rendering orchestrator
- **Create:** `/src/components/Website/sections/` - Reusable section components directory
- **Create:** `/src/components/Website/sections/Hero.tsx` - Hero section with template variations
- **Create:** `/src/components/Website/sections/About.tsx` - About section component
- **Create:** `/src/components/Website/sections/Services.tsx` - Services/Products section
- **Create:** `/src/components/Website/sections/Gallery.tsx` - Image gallery (for restaurants/retail)
- **Create:** `/src/components/Website/sections/Contact.tsx` - Contact section with variations
- **Create:** `/src/components/Website/sections/Footer.tsx` - Footer component

#### Template-Specific Layouts
- **Create:** `/src/components/Website/templates/` - Template-specific layouts directory
- **Create:** `/src/components/Website/templates/ModernBusiness.tsx` - Modern business template
- **Create:** `/src/components/Website/templates/Restaurant.tsx` - Restaurant template
- **Create:** `/src/components/Website/templates/Retail.tsx` - Retail template

#### Component Architecture Example

```typescript
// src/components/Website/WebsiteRenderer.tsx
import React from 'react';
import { WebsiteData } from '../../types';
import ModernBusiness from './templates/ModernBusiness';
import Restaurant from './templates/Restaurant';
import Retail from './templates/Retail';

interface WebsiteRendererProps {
  website: WebsiteData;
  isEditable?: boolean;
  onEdit?: (section: string, field: string) => void;
}

export default function WebsiteRenderer({ website, isEditable = false, onEdit }: WebsiteRendererProps) {
  const getTemplateComponent = () => {
    switch (website.template_id) {
      case 'restaurant':
        return <Restaurant website={website} isEditable={isEditable} onEdit={onEdit} />;
      case 'retail':
        return <Retail website={website} isEditable={isEditable} onEdit={onEdit} />;
      case 'modern_business':
      default:
        return <ModernBusiness website={website} isEditable={isEditable} onEdit={onEdit} />;
    }
  };

  return (
    <div className="website-container">
      {getTemplateComponent()}
    </div>
  );
}
```

```typescript
// src/components/Website/sections/Hero.tsx
import React from 'react';
import { WebsiteContent } from '../../../types';

interface HeroProps {
  content: WebsiteContent['hero'];
  template: string;
  colorScheme: any;
  isEditable?: boolean;
  onEdit?: (field: string) => void;
}

export default function Hero({ content, template, colorScheme, isEditable, onEdit }: HeroProps) {
  const getTemplateStyles = () => {
    switch (template) {
      case 'restaurant':
        return `bg-gradient-to-r from-${colorScheme.primary} to-${colorScheme.secondary} min-h-screen flex items-center`;
      case 'retail':
        return `bg-gradient-to-br from-${colorScheme.primary} via-${colorScheme.accent} to-${colorScheme.secondary} py-24`;
      default:
        return `bg-gradient-to-r from-${colorScheme.primary} to-${colorScheme.secondary} py-20`;
    }
  };

  return (
    <section className={`text-white ${getTemplateStyles()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          className={`font-bold mb-6 ${
            template === 'restaurant' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl'
          }`}
          onClick={() => isEditable && onEdit?.('headline')}
        >
          {content.headline}
        </h1>
        <p 
          className={`mb-8 opacity-90 ${
            template === 'restaurant' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
          onClick={() => isEditable && onEdit?.('subheadline')}
        >
          {content.subheadline}
        </p>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
          {content.ctaText}
        </button>
      </div>
    </section>
  );
}
```

### Template-Specific Features

#### Restaurant Template Enhancements
- Warm color schemes (oranges, reds, yellows)
- Food-focused imagery placeholders
- Menu-style services section
- Location prominence in contact section
- Larger hero images and typography

#### Retail Template Enhancements
- Product-focused layout
- Grid-based services/products section
- Trust indicators (testimonials, reviews)
- E-commerce call-to-actions
- Product gallery section

#### Modern Business Template
- Clean, professional aesthetics
- Service-oriented sections
- Contact forms emphasis
- Achievement/stats sections
- Team introduction areas

### Files to Update
- **Update:** `/src/pages/WebsitePreview.tsx` - Use WebsiteRenderer instead of custom JSX

### Success Criteria
- [ ] Template components render correctly for each business type
- [ ] Responsive design works across all templates
- [ ] Template selection automatically applies appropriate styling
- [ ] WebsitePreview page uses new template system
- [ ] No regression in existing website display functionality

---

## Sub-Iteration 2C: Enhanced Chat Interface & Basic Editing
**Timeline: 2-3 days**
**Dependencies: 2B completed**

### Goals
- Create enhanced chat interface for website editing
- Implement basic content editing via chat
- Add real-time preview capabilities
- Create chat session management

### Files to Create

#### Enhanced Chat Interface
- **Create:** `/src/components/Chat/EditingChat.tsx` - Main chat interface for editing
- **Create:** `/src/components/Chat/ChatSidebar.tsx` - Collapsible chat sidebar
- **Create:** `/src/components/Chat/WebsitePreviewPanel.tsx` - Live preview panel
- **Create:** `/src/hooks/useWebsiteEditor.ts` - State management for editing

#### Chat Enhancement Components
- **Update:** `/src/components/Chat/ChatInterface.tsx` - Add editing capabilities
- **Create:** `/src/components/Chat/ChatSuggestions.tsx` - Context-aware suggestions
- **Create:** `/src/components/Chat/EditingCommands.tsx` - Quick edit buttons

#### New Supabase Edge Function
- **Create:** `/supabase/functions/update-website/index.ts` - Handle website updates via chat

### Chat Editing Architecture

```typescript
// src/hooks/useWebsiteEditor.ts
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface EditingSession {
  websiteId: string;
  chatSessionId: string;
  isEditing: boolean;
  previewMode: boolean;
  pendingChanges: any;
}

export function useWebsiteEditor(websiteId: string) {
  const [session, setSession] = useState<EditingSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startEditingSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Create or resume chat session
      const { data: chatSession, error } = await supabase
        .from('chat_sessions')
        .upsert({
          page_id: websiteId,
          is_active: true,
          session_data: { editing_mode: true }
        })
        .select()
        .single();

      if (error) throw error;

      setSession({
        websiteId,
        chatSessionId: chatSession.id,
        isEditing: true,
        previewMode: true,
        pendingChanges: {}
      });
    } catch (error) {
      console.error('Failed to start editing session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [websiteId]);

  const sendEditingMessage = useCallback(async (message: string) => {
    if (!session) return;

    try {
      setIsLoading(true);

      // Save user message
      await supabase.from('chat_messages').insert({
        session_id: session.chatSessionId,
        message,
        is_user: true,
        message_type: 'edit'
      });

      // Process editing request
      const { data, error } = await supabase.functions.invoke('update-website', {
        body: {
          websiteId: session.websiteId,
          message,
          sessionId: session.chatSessionId
        }
      });

      if (error) throw error;

      // Save AI response
      await supabase.from('chat_messages').insert({
        session_id: session.chatSessionId,
        message: data.response,
        is_user: false,
        message_type: 'edit',
        metadata: { changes: data.changes }
      });

      return data;
    } catch (error) {
      console.error('Failed to process editing message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return {
    session,
    isLoading,
    startEditingSession,
    sendEditingMessage
  };
}
```

### Edge Function for Website Updates

```typescript
// supabase/functions/update-website/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { websiteId, message, sessionId } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch current website data
    const { data: website, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', websiteId)
      .single()

    if (fetchError) throw fetchError

    // Analyze editing request with OpenAI
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI website editor. Analyze the user's editing request and return JSON with the changes to make.
            
            Current website data: ${JSON.stringify(website.content)}
            
            Return JSON in this format:
            {
              "intent": "update_headline|update_service|change_color|add_content|etc",
              "section": "hero|about|services|contact",
              "field": "headline|subheadline|services|etc",
              "newValue": "the new content",
              "explanation": "explanation of what was changed"
            }`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
      }),
    })

    const analysisData = await analysisResponse.json()
    const changes = JSON.parse(analysisData.choices[0].message.content)

    // Apply changes to website content
    const updatedContent = { ...website.content }
    
    if (changes.section && changes.field && changes.newValue) {
      if (changes.section === 'hero') {
        updatedContent.hero[changes.field] = changes.newValue
      } else if (changes.section === 'services' && changes.field === 'add') {
        updatedContent.servicesList.push(changes.newValue)
      } else if (changes.section === 'contact') {
        updatedContent.contact[changes.field] = changes.newValue
      } else {
        updatedContent[changes.field] = changes.newValue
      }
    }

    // Update website in database
    const { error: updateError } = await supabase
      .from('pages')
      .update({ 
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', websiteId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        response: changes.explanation,
        changes: changes,
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### Enhanced Chat Interface Component

```typescript
// src/components/Chat/EditingChat.tsx
import React, { useState, useEffect } from 'react';
import { useWebsiteEditor } from '../../hooks/useWebsiteEditor';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface EditingChatProps {
  websiteId: string;
  onWebsiteUpdate?: () => void;
}

export default function EditingChat({ websiteId, onWebsiteUpdate }: EditingChatProps) {
  const { session, isLoading, startEditingSession, sendEditingMessage } = useWebsiteEditor(websiteId);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!session) {
      startEditingSession();
    }
  }, [session, startEditingSession]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { id: Date.now(), message, is_user: true };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await sendEditingMessage(message);
      const aiMessage = { 
        id: Date.now() + 1, 
        message: response.response, 
        is_user: false,
        metadata: response.changes
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Trigger website update in parent component
      onWebsiteUpdate?.();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-sm text-gray-500 mb-4">
          Chat with AI to edit your website
        </div>
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} {...msg} />
        ))}
        
        {isLoading && <TypingIndicator />}
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tell me what to change..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Try: "Change the headline", "Update phone number", "Add a new service"
        </div>
      </div>
    </div>
  );
}
```

### Files to Update
- **Update:** `/src/pages/WebsitePreview.tsx` - Add editing mode toggle and chat sidebar

### Success Criteria
- [ ] Chat interface can process basic editing commands
- [ ] Website content updates in real-time after chat edits
- [ ] Chat session management works correctly
- [ ] Basic editing commands work (headlines, services, contact info)
- [ ] Changes are persisted to database
- [ ] Error handling for failed edits

---

## Sub-Iteration 2D: Website Sharing & Public Access
**Timeline: 1-2 days**
**Dependencies: 2C completed**

### Goals
- Implement website sharing functionality
- Create public website routes separate from preview
- Add social sharing capabilities
- Implement basic analytics tracking

### Database Changes

```sql
-- Add sharing and analytics fields
ALTER TABLE pages ADD COLUMN view_count INTEGER DEFAULT 0;
ALTER TABLE pages ADD COLUMN shared_count INTEGER DEFAULT 0;
ALTER TABLE pages ADD COLUMN last_viewed_at TIMESTAMP WITH TIME ZONE;

-- Create simple analytics table
CREATE TABLE page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_views_page_id ON page_views(page_id);
CREATE INDEX idx_page_views_date ON page_views(viewed_at);
```

### Files to Create

#### Public Website Routes
- **Create:** `/src/pages/PublicWebsite.tsx` - Public-facing website viewer
- **Update:** `/src/App.tsx` - Add public website route (`/site/:slug`)

#### Sharing Components
- **Create:** `/src/components/Sharing/ShareButton.tsx` - Share functionality
- **Create:** `/src/components/Sharing/SocialShare.tsx` - Social media sharing
- **Create:** `/src/components/Analytics/ViewTracker.tsx` - Track page views

#### Utilities
- **Create:** `/src/utils/socialSharing.ts` - Social sharing utilities
- **Create:** `/src/services/analyticsService.ts` - Analytics tracking

### Public Website Component

```typescript
// src/pages/PublicWebsite.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { WebsiteRenderer } from '../components/Website/WebsiteRenderer';
import { ViewTracker } from '../components/Analytics/ViewTracker';

export default function PublicWebsite() {
  const { slug } = useParams<{ slug: string }>();
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (slug) {
      fetchAndTrackWebsite(slug);
    }
  }, [slug]);

  const fetchAndTrackWebsite = async (websiteSlug: string) => {
    try {
      // Fetch website
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', websiteSlug)
        .eq('is_published', true) // Only show published websites
        .single();

      if (error) throw error;
      
      setWebsite(data);
      
      // Track view
      await trackPageView(data.id);
      
    } catch (err: any) {
      setError('Website not found or not published');
      console.error('Error fetching website:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async (pageId: string) => {
    try {
      // Track in page_views table
      await supabase.from('page_views').insert({
        page_id: pageId,
        visitor_ip: null, // Will be set by RLS policy if needed
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      });

      // Update view count
      await supabase
        .from('pages')
        .update({ 
          view_count: supabase.sql`view_count + 1`,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', pageId);
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading website...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ViewTracker pageId={website.id} />
      <WebsiteRenderer website={website} />
    </>
  );
}
```

### Social Sharing Component

```typescript
// src/components/Sharing/SocialShare.tsx
import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import { toast } from 'sonner'; // Assuming we'll add toast notifications

interface SocialShareProps {
  websiteUrl: string;
  title: string;
  description: string;
}

export default function SocialShare({ websiteUrl, title, description }: SocialShareProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(websiteUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}`
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 flex items-center">
        <Share2 className="h-4 w-4 mr-1" />
        Share:
      </span>
      
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Facebook className="h-4 w-4" />
      </a>
      
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Twitter className="h-4 w-4" />
      </a>
      
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      
      <button
        onClick={copyToClipboard}
        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}
```

### Files to Update
- **Update:** `/src/App.tsx` - Add public website route
- **Update:** `/src/pages/WebsitePreview.tsx` - Add sharing functionality

### Routing Updates

```typescript
// Updated src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import WebsitePreview from './pages/WebsitePreview'
import PublicWebsite from './pages/PublicWebsite'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/preview/:slug" element={<WebsitePreview />} />
        <Route path="/site/:slug" element={<PublicWebsite />} />
      </Routes>
    </Router>
  )
}

export default App
```

### Success Criteria
- [ ] Public websites accessible via `/site/:slug` URLs
- [ ] Share functionality works across social platforms
- [ ] Basic analytics tracking records page views
- [ ] Copy link functionality works
- [ ] Published/unpublished status controls public access
- [ ] View counts update correctly

---

## Sub-Iteration 2E: Polish & Integration Testing
**Timeline: 1 day**
**Dependencies: All previous sub-iterations completed**

### Goals
- Polish user experience and fix any integration issues
- Comprehensive testing of all new features
- Performance optimization
- Documentation updates

### Tasks

#### User Experience Polish
- [ ] Add loading states for all async operations
- [ ] Improve error handling and user feedback
- [ ] Add toast notifications for user actions
- [ ] Smooth animations and transitions
- [ ] Mobile responsiveness verification

#### Integration Testing
- [ ] Test complete flow: generate → preview → edit → share
- [ ] Verify all template types work correctly
- [ ] Test chat editing with various commands
- [ ] Verify sharing functionality across platforms
- [ ] Test analytics tracking

#### Performance Optimization
- [ ] Optimize component re-renders
- [ ] Implement proper loading states
- [ ] Add error boundaries
- [ ] Optimize bundle size

#### Documentation
- [ ] Update API documentation
- [ ] Document new database schema
- [ ] Create user guide for editing features

### Files to Create/Update
- **Create:** `/src/components/common/ErrorBoundary.tsx` - Error boundary component
- **Update:** Package.json - Add any missing dependencies (toast notifications, etc.)
- **Update:** `/src/components/Chat/LoadingStates.tsx` - Enhanced loading states

### Success Criteria
- [ ] All features work seamlessly together
- [ ] No breaking changes to existing functionality
- [ ] Responsive design works on all devices
- [ ] Performance is acceptable on slower devices
- [ ] Error handling provides helpful feedback to users

---

## Overall Success Criteria for Iteration 2

### Core Functionality
- [ ] Users can generate websites that automatically use appropriate templates
- [ ] Generated websites look professional and are responsive
- [ ] Users can edit website content through natural language chat
- [ ] Real-time preview updates as users make edits
- [ ] Websites can be shared publicly via unique URLs
- [ ] Basic analytics track website views

### Technical Implementation
- [ ] Template system is extensible for new business types
- [ ] Chat editing supports multiple content types (headlines, services, contact info)
- [ ] Database schema supports all new features
- [ ] No performance regressions from new functionality
- [ ] All new features are properly typed with TypeScript

### User Experience
- [ ] Intuitive interface for switching between preview and edit modes
- [ ] Clear feedback when edits are applied
- [ ] Sharing functionality is easy to discover and use
- [ ] Error states provide helpful guidance
- [ ] Mobile experience is fully functional

## Dependencies and Risks

### Technical Dependencies
- OpenAI API availability and performance
- Supabase database and edge functions working correctly
- React Router functioning properly

### Risk Mitigation
- **Template complexity:** Start with 3 simple templates, can extend later
- **Chat editing accuracy:** Use structured prompts and validation
- **Performance concerns:** Implement proper loading states and optimize renders
- **Mobile responsiveness:** Test frequently during development

## Next Steps After Iteration 2

With Iteration 2 complete, the foundation will be in place for:
- **Iteration 3:** Advanced chat intelligence and content generation
- **Iteration 4:** User accounts, website management, and advanced features

This plan provides a clear, actionable roadmap for implementing a professional website display and editing system that maintains the conversational AI approach while adding substantial functionality.