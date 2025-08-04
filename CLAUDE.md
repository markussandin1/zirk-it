# Zirk.it - AI-Powered Website Generator

## Project Overview
Zirk.it is an AI-based web service that generates professional, mobile-optimized websites for small businesses in minutes. Users enter a business name or link to their Facebook profile, choose industry and tone, and get a complete website without writing any text themselves.

**Vision**: "Your business. Connected." - Help small businesses own their digital presence rather than depend on social platforms.

## Tech Stack
- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Supabase (Edge Functions + PostgreSQL)
- **AI**: OpenAI GPT-4o (modular prompts per section)
- **Hosting**: Vercel + zirk.it domain
- **CI/CD**: GitHub + Vercel Deploy Hooks
- **Local Dev**: Supabase CLI, pnpm, .env.local

## Development Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start Supabase locally
supabase start

# Generate types from Supabase
supabase gen types typescript --local > types/database.types.ts

# Deploy to production
git push origin main  # Auto-deploys via Vercel
```

## MVP Development Plan

### Iteration 0 - Setup (Day 1)
- [x] GitHub repo + CI/CD via Vercel
- [x] Supabase project + local CLI environment
- [x] Hello World page deployed via main

### Iteration 1 - Manual Input → Complete Site (Day 2-3)
- [ ] Form: business name + description + services
- [ ] Render complete site with Hero/About/Services/Contact components

### Iteration 2 - AI Generation (Day 3-4)
- [ ] Call OpenAI with structured prompt per section
- [ ] Return JSON structure and render site based on it

### Iteration 3 - Facebook Scraping (Day 4-5)
- [ ] Extract content from linked FB page
- [ ] Use as input to AI generation

### Iteration 4 - Save & Display (Day 5-6)
- [ ] Supabase pages table + route /s/[slug]
- [ ] QR code + sharing link

### Iteration 5 - Feedback & Logging (Day 6-7)
- [ ] User feedback (rating, comment)
- [ ] Storage in Supabase + Slack webhook for alerts

## Database Schema
```sql
-- Pages table for generated websites
create table pages (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  business_name text not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Feedback table
create table feedback (
  id uuid default gen_random_uuid() primary key,
  page_id uuid references pages(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Facebook (for scraping)
FACEBOOK_ACCESS_TOKEN=your_facebook_token
```

## Pricing Tiers
- **Starter** (99 kr/month): Generated site, subdomain, 5 syncs/month
- **Growth** (299 kr/month): Custom domain, AI SEO, Google Ads, auto-updates  
- **Pro** (699 kr/month): Booking, Google My Business sync, analytics

## Brand Guidelines
- Focus on simplicity and control
- Emphasize "digital ownership" 
- AI intelligence works in background - not the main selling point
- "The future isn't social platforms you don't own. The future is Zirk.it."

## Agent System
This project uses specialized AI agents for different tasks:

- **agent-factory**: Creates and manages other agents
- **website-generator**: Generates website content using AI  
- **facebook-scraper**: Extracts content from Facebook pages
- **supabase-manager**: Handles database operations
- **seo-optimizer**: Optimizes content for search engines

### Using Agents
Agents are invoked through Claude Code's Task tool:
```
Use Task tool with subagent_type: "website-generator" 
to generate content for a restaurant business
```

### MCP Integration
The project uses Model Context Protocol (MCP) servers for enhanced capabilities:
- **Supabase MCP**: Database operations
- **GitHub MCP**: Repository management  
- **Web MCP**: Content scraping
- **Filesystem MCP**: Enhanced file operations
- **SQLite MCP**: Local development database

## Notes for Claude
- Always run `pnpm build` and `pnpm lint` before considering tasks complete
- Use Supabase Edge Functions for API endpoints
- Follow Next.js 14 app router conventions
- Implement responsive design with Tailwind CSS
- Keep components modular and reusable
- Use specialized agents for domain-specific tasks
- Leverage MCP servers for enhanced functionality