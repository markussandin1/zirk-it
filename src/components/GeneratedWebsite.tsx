import { PageContent } from '@/types/database'

interface GeneratedWebsiteProps {
  businessName: string
  content: PageContent
}

export default function GeneratedWebsite({ businessName, content }: GeneratedWebsiteProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {content.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {content.hero.subtitle}
          </p>
          {content.hero.cta_text && (
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              {content.hero.cta_text}
            </button>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {content.about.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content.about.description}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            {content.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.services.items.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                {service.price && (
                  <div className="text-blue-600 font-semibold text-lg">
                    {service.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            {content.contact.title}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {content.contact.email && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-blue-400 text-2xl mb-3">✉️</div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href={`mailto:${content.contact.email}`} className="text-blue-400 hover:text-blue-300">
                    {content.contact.email}
                  </a>
                </div>
              )}
              
              {content.contact.phone && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-blue-400 text-2xl mb-3">📞</div>
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href={`tel:${content.contact.phone}`} className="text-blue-400 hover:text-blue-300">
                    {content.contact.phone}
                  </a>
                </div>
              )}
              
              {content.contact.address && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="text-blue-400 text-2xl mb-3">📍</div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-gray-300">
                    {content.contact.address}
                  </p>
                </div>
              )}
            </div>
            
            {content.contact.hours && (
              <div className="mt-8 text-center">
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <p className="text-gray-300">{content.contact.hours}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 {businessName}. Website created with{' '}
            <a href="https://zirk.it" className="text-blue-400 hover:text-blue-300">
              Zirk.it
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}