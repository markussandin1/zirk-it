import { PageContent } from '@/types/database'
import DynamicIcon from './DynamicIcon'

interface GeneratedWebsiteProps {
  businessName: string
  content: PageContent
}

export default function GeneratedWebsite({ businessName, content }: GeneratedWebsiteProps) {
  // Extract design tokens or use defaults
  const designTokens = content.designTokens
  
  // Create CSS custom properties for dynamic styling
  const cssVariables = designTokens ? {
    '--primary-color': designTokens.colorPalette.primary,
    '--secondary-color': designTokens.colorPalette.secondary,
    '--accent-color': designTokens.colorPalette.accent,
    '--neutral-light': designTokens.colorPalette.neutral.light,
    '--neutral-medium': designTokens.colorPalette.neutral.medium,
    '--neutral-dark': designTokens.colorPalette.neutral.dark,
  } as React.CSSProperties : {}

  // Determine styling classes based on design tokens
  const getHeroBackgroundClasses = () => {
    if (content.hero.image) return 'bg-black'
    
    if (!designTokens) return 'bg-gradient-to-r from-blue-600 to-purple-600'
    
    // Use design tokens for gradient
    return ''  // Will use inline styles instead
  }

  const getCardClasses = () => {
    if (!designTokens) return 'bg-white rounded-xl shadow-md p-8'
    
    const cardStyle = designTokens.components.cardStyle
    const padding = designTokens.spacing.cardPadding
    const shadow = designTokens.components.shadowIntensity
    
    let classes = 'bg-white '
    
    // Card style
    if (cardStyle === 'rounded') classes += 'rounded-xl '
    else if (cardStyle === 'sharp') classes += 'rounded-lg '
    else if (cardStyle === 'organic') classes += 'rounded-3xl '
    
    // Shadow
    if (shadow === 'subtle') classes += 'shadow-sm '
    else if (shadow === 'medium') classes += 'shadow-md '  
    else if (shadow === 'strong') classes += 'shadow-lg '
    
    // Padding - use larger padding for better spacing
    classes += padding || 'p-8'
    
    return classes
  }

  const getButtonClasses = () => {
    if (!designTokens) return 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl min-h-[56px] focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50'
    
    const buttonStyle = designTokens.components.buttonStyle
    let classes = 'font-semibold px-8 py-4 rounded-lg text-lg transition-all min-h-[56px] focus:outline-none focus:ring-4 focus:ring-opacity-50 '
    
    if (buttonStyle === 'solid') {
      classes += 'text-white hover:opacity-90 shadow-lg hover:shadow-xl focus:ring-blue-300'
    } else if (buttonStyle === 'outline') {
      classes += 'border-2 bg-transparent hover:bg-opacity-10 shadow-md hover:shadow-lg focus:ring-blue-300'
    } else if (buttonStyle === 'minimal') {
      classes += 'bg-transparent underline hover:no-underline shadow-sm focus:ring-gray-300'
    }
    
    return classes
  }

  const getSectionPadding = () => {
    return designTokens?.spacing?.sectionPadding || 'py-16 md:py-24'
  }

  return (
    <div className="min-h-screen" style={cssVariables}>
      {/* Header with Logo */}
      {content.branding?.logo && (
        <header className="bg-white shadow-sm py-4">
          <div className="container mx-auto px-4">
            <img 
              src={content.branding.logo} 
              alt={`${businessName} logo`}
              className="h-12 md:h-16 object-contain"
            />
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section 
        className={`relative py-24 md:py-32 text-white ${getHeroBackgroundClasses()}`}
        style={!content.hero.image && designTokens ? {
          background: `linear-gradient(to right, ${designTokens.colorPalette.primary}, ${designTokens.colorPalette.secondary})`,
          minHeight: '80vh'
        } : { minHeight: '80vh' }}
      >
        {content.hero.image && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.hero.image})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </>
        )}
        <div className="relative container mx-auto px-6 md:px-8 text-center">
          <h1 
            className={`font-bold mb-6 ${designTokens?.typography?.fontScale?.hero || 'text-5xl md:text-6xl'}`}
            style={designTokens ? { 
              fontFamily: designTokens.typography.headingFont,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              lineHeight: '1.1'
            } : { 
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              lineHeight: '1.1'
            }}
          >
            {content.hero.title}
          </h1>
          <p 
            className={`mb-8 max-w-2xl mx-auto ${designTokens?.typography?.fontScale?.body || 'text-lg md:text-xl'}`}
            style={designTokens ? { 
              fontFamily: designTokens.typography.bodyFont,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              lineHeight: '1.6'
            } : { 
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
              lineHeight: '1.6'
            }}
          >
            {content.hero.subtitle}
          </p>
          {content.hero.cta_text && (
            <button 
              className={getButtonClasses()}
              style={designTokens && designTokens.components.buttonStyle === 'solid' ? {
                backgroundColor: 'var(--primary-color)',
                borderColor: 'var(--primary-color)'
              } : designTokens && designTokens.components.buttonStyle === 'outline' ? {
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)'
              } : {}}
            >
              {content.hero.cta_text}
            </button>
          )}
        </div>
      </section>

      {/* About Section */}
      <section 
        className={getSectionPadding()}
        style={{
          backgroundColor: designTokens ? designTokens.colorPalette.neutral.light : '#F9FAFB'
        }}
      >
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className={`font-bold mb-8 ${designTokens?.typography?.fontScale?.heading || 'text-3xl md:text-4xl'}`}
              style={{
                fontFamily: designTokens?.typography?.headingFont,
                color: designTokens ? designTokens.colorPalette.neutral.dark : '#1F2937',
                lineHeight: '1.2'
              }}
            >
              {content.about.title}
            </h2>
            <p 
              className={`leading-relaxed max-w-3xl mx-auto ${designTokens?.typography?.fontScale?.body || 'text-lg md:text-xl'}`}
              style={{
                fontFamily: designTokens?.typography?.bodyFont,
                color: designTokens ? designTokens.colorPalette.neutral.medium : '#4B5563',
                lineHeight: '1.7'
              }}
            >
              {content.about.description}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={getSectionPadding()}>
        <div className="container mx-auto px-6 md:px-8">
          <h2 
            className={`font-bold text-center mb-16 ${designTokens?.typography?.fontScale?.heading || 'text-3xl md:text-4xl'}`}
            style={{
              fontFamily: designTokens?.typography?.headingFont,
              color: designTokens ? designTokens.colorPalette.neutral.dark : '#1F2937',
              lineHeight: '1.2'
            }}
          >
            {content.services.title}
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto ${designTokens?.spacing?.elementGap || 'gap-8'}`}>
            {content.services.items.map((service, index) => (
              <div key={index} className={`${getCardClasses()} hover:shadow-xl transition-all duration-300 text-center`}>
                {/* Icon */}
                {service.icon && (
                  <div 
                    className="flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
                    style={{
                      backgroundColor: designTokens ? `${designTokens.colorPalette.primary}20` : '#DBEAFE'
                    }}
                  >
                    <DynamicIcon 
                      name={service.icon} 
                      size={40} 
                      style={{
                        color: designTokens ? designTokens.colorPalette.primary : '#2563EB'
                      }}
                    />
                  </div>
                )}
                
                <h3 
                  className={`font-semibold mb-3 text-center ${designTokens?.typography?.fontScale?.body || 'text-xl'}`}
                  style={{
                    fontFamily: designTokens?.typography?.headingFont,
                    color: designTokens ? designTokens.colorPalette.neutral.dark : '#1F2937'
                  }}
                >
                  {service.name}
                </h3>
                <p 
                  className={`mb-4 text-center ${designTokens?.typography?.fontScale?.body || 'text-base'}`}
                  style={{
                    fontFamily: designTokens?.typography?.bodyFont,
                    color: designTokens ? designTokens.colorPalette.neutral.medium : '#4B5563'
                  }}
                >
                  {service.description}
                </p>
                {service.price && (
                  <div 
                    className={`font-semibold text-center ${designTokens?.typography?.fontScale?.body || 'text-lg'}`}
                    style={{
                      color: designTokens ? designTokens.colorPalette.primary : '#2563EB'
                    }}
                  >
                    {service.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        className={`${getSectionPadding()} text-white`}
        style={{
          backgroundColor: designTokens ? designTokens.colorPalette.neutral.dark : '#111827'
        }}
      >
        <div className="container mx-auto px-6 md:px-8">
          <h2 
            className={`font-bold text-center mb-16 ${designTokens?.typography?.fontScale?.heading || 'text-3xl md:text-4xl'}`}
            style={{
              fontFamily: designTokens?.typography?.headingFont,
              lineHeight: '1.2'
            }}
          >
            {content.contact.title}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-center ${designTokens?.spacing?.elementGap || 'gap-8'}`}>
              {content.contact.email && (
                <div 
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: designTokens ? `${designTokens.colorPalette.neutral.medium}40` : '#374151'
                  }}
                >
                  <div className="text-2xl mb-3" style={{ color: designTokens?.colorPalette.accent || '#60A5FA' }}>✉️</div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a 
                    href={`mailto:${content.contact.email}`} 
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: designTokens?.colorPalette.accent || '#60A5FA' }}
                  >
                    {content.contact.email}
                  </a>
                </div>
              )}
              
              {content.contact.phone && (
                <div 
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: designTokens ? `${designTokens.colorPalette.neutral.medium}40` : '#374151'
                  }}
                >
                  <div className="text-2xl mb-3" style={{ color: designTokens?.colorPalette.accent || '#60A5FA' }}>📞</div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a 
                    href={`tel:${content.contact.phone}`} 
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: designTokens?.colorPalette.accent || '#60A5FA' }}
                  >
                    {content.contact.phone}
                  </a>
                </div>
              )}
              
              {content.contact.address && (
                <div 
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: designTokens ? `${designTokens.colorPalette.neutral.medium}40` : '#374151'
                  }}
                >
                  <div className="text-2xl mb-3" style={{ color: designTokens?.colorPalette.accent || '#60A5FA' }}>📍</div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="opacity-80">
                    {content.contact.address}
                  </p>
                </div>
              )}
            </div>
            
            {content.contact.hours && (
              <div className="mt-8 text-center">
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <p className="opacity-80">{content.contact.hours}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8"
        style={{
          backgroundColor: designTokens ? designTokens.colorPalette.neutral.dark : '#000000'
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-60 text-white">
            © 2024 {businessName}. Website created with{' '}
            <a 
              href="https://zirk.it" 
              className="hover:opacity-80 transition-opacity"
              style={{ color: designTokens?.colorPalette.accent || '#60A5FA' }}
            >
              Zirk.it
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}