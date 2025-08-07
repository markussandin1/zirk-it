import { notFound } from 'next/navigation'
import { pages } from '@/lib/database'
import GeneratedWebsite from '@/components/GeneratedWebsite'
import DevTools from '@/components/DevTools'
import { PageContent } from '@/types/database'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function GeneratedSitePage({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch page data from database
  const page = await pages.getBySlug(slug)
  
  if (!page) {
    notFound()
  }

  // Type assertion for content (we know it matches our structure)
  const content = page.content as unknown as PageContent

  return (
    <>
      <GeneratedWebsite 
        businessName={page.business_name}
        content={content}
      />
      <DevTools slug={slug} />
    </>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = await pages.getBySlug(slug)
  
  if (!page) {
    return {
      title: 'Page Not Found'
    }
  }

  const content = page.content as unknown as PageContent

  return {
    title: `${page.business_name} - ${content.hero.subtitle}`,
    description: content.about.description.substring(0, 160),
    openGraph: {
      title: page.business_name,
      description: content.about.description,
      type: 'website',
    },
  }
}