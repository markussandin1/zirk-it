import { notFound } from 'next/navigation'
import { pages } from '@/lib/database'
import GeneratedWebsite from '@/components/GeneratedWebsite'
// import DevTools from '@/components/DevTools'
import { PageContent } from '@/types/database'

interface PageProps {
  searchParams: Promise<{
    slug?: string
  }>
}

export default async function GeneratedSitePage({ searchParams }: PageProps) {
  try {
    const { slug } = await searchParams
    
    if (!slug) {
      notFound()
    }
    
    // Fetch page data from database
    const page = await pages.getBySlug(slug)
    
    if (!page) {
      notFound()
    }

    // Type assertion for content (we know it matches our structure)
    const content = page.content as unknown as PageContent

    return (
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        {/* Hero Section */}
        <div style={{ 
          background: content.designTokens?.colorPalette ? 
            `linear-gradient(to right, ${content.designTokens.colorPalette.primary}, ${content.designTokens.colorPalette.secondary})` : 
            'linear-gradient(to right, #2563EB, #7C3AED)',
          color: 'white', 
          padding: '60px 20px', 
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{content.hero?.title}</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
            {content.hero?.subtitle}
          </p>
          {content.hero?.cta_text && (
            <button style={{ 
              padding: '15px 30px', 
              backgroundColor: 'white', 
              color: '#2563EB', 
              border: 'none', 
              borderRadius: '5px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {content.hero.cta_text}
            </button>
          )}
        </div>

        {/* About Section */}
        <div style={{ backgroundColor: '#F9FAFB', padding: '40px 20px', borderRadius: '8px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px', textAlign: 'center', color: '#1F2937' }}>
            {content.about?.title}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto', color: '#4B5563' }}>
            {content.about?.description}
          </p>
        </div>

        {/* Services Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center', color: '#1F2937' }}>
            {content.services?.title}
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {content.services?.items?.map((service: any, index: number) => (
              <div key={index} style={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                padding: '25px', 
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#1F2937' }}>
                  {service.name}
                </h3>
                {service.description && (
                  <p style={{ color: '#6B7280', marginBottom: '10px' }}>{service.description}</p>
                )}
                {service.price && (
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: content.designTokens?.colorPalette?.primary || '#2563EB' }}>
                    {service.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ 
          backgroundColor: content.designTokens?.colorPalette?.neutral?.dark || '#111827', 
          color: 'white', 
          padding: '40px 20px', 
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
            {content.contact?.title}
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            {content.contact?.email && (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📧</div>
                <h3 style={{ marginBottom: '10px' }}>Email</h3>
                <a href={`mailto:${content.contact.email}`} style={{ color: '#60A5FA' }}>
                  {content.contact.email}
                </a>
              </div>
            )}
            {content.contact?.phone && (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📞</div>
                <h3 style={{ marginBottom: '10px' }}>Phone</h3>
                <a href={`tel:${content.contact.phone}`} style={{ color: '#60A5FA' }}>
                  {content.contact.phone}
                </a>
              </div>
            )}
            {content.contact?.address && (
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📍</div>
                <h3 style={{ marginBottom: '10px' }}>Address</h3>
                <p style={{ opacity: 0.8 }}>{content.contact.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          marginTop: '40px', 
          borderTop: '1px solid #E5E7EB',
          color: '#6B7280' 
        }}>
          <p>
            © 2024 {page.business_name}. Website created with{' '}
            <a href="https://zirk.it" style={{ color: '#2563EB' }}>Zirk.it</a>
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Generated site page error:', error)
    return <div>Error loading page</div>
  }
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: PageProps) {
  const { slug } = await searchParams
  
  if (!slug) {
    return {
      title: 'Page Not Found'
    }
  }
  
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