import React from 'react';
import { Star, Truck, Shield, Award } from 'lucide-react';
import { TemplateProps } from '../../../types/templates';
import { getTemplateById } from '../../../utils/templateSelector';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Services from '../sections/Services';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

export default function Retail({ website, isEditable = false, onEdit }: TemplateProps) {
  const template = getTemplateById('retail');
  
  if (!template) {
    console.error('Retail template not found');
    return <div>Template not found</div>;
  }

  const colorScheme = template.colorScheme;
  const { content } = website;

  return (
    <div className="website-container retail-template">
      {/* Hero Section */}
      <Hero
        content={content.hero}
        template="retail"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('hero', field) : undefined}
      />

      {/* Trust Indicators Section (Retail-specific) */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Free Shipping</span>
              <span className="text-xs text-gray-500">Orders over $50</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Secure Payment</span>
              <span className="text-xs text-gray-500">SSL Protected</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Quality Guarantee</span>
              <span className="text-xs text-gray-500">100% Authentic</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">5-Star Reviews</span>
              <span className="text-xs text-gray-500">1000+ customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <About
        content={content.about}
        template="retail"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('about', field) : undefined}
      />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our most popular items</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-green-100 flex items-center justify-center text-6xl">
                  🛍️
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Featured Product {item}</h3>
                  <p className="text-gray-600 text-sm mb-4">High-quality product with excellent reviews and fast shipping.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">$99.99</span>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products/Services Section */}
      <Services
        services={content.servicesList || content.services || []}
        template="retail"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('services', field) : undefined}
      />

      {/* Testimonials Section (Retail-specific) */}
      {content.testimonials && content.testimonials.length > 0 ? (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600">Real reviews from real customers</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {content.testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-green-800">{testimonial.author}</p>
                    {testimonial.role && (
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Customer Reviews</h2>
              <p className="text-lg text-gray-600">Join thousands of satisfied customers</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah M.", review: "Amazing quality and fast delivery! Highly recommend this store.", rating: 5 },
                { name: "John D.", review: "Great customer service and excellent products. Will shop here again!", rating: 5 },
                { name: "Emma K.", review: "Best shopping experience I've had online. Professional and reliable.", rating: 5 }
              ].map((review, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{review.review}"</p>
                  <p className="font-semibold text-green-800">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup (Retail-specific) */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl opacity-90 mb-8">Get the latest deals and product updates</p>
          
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="px-6 py-3 bg-green-800 hover:bg-green-900 rounded-r-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
          
          <p className="text-sm opacity-75 mt-4">
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <Contact
        contact={content.contact}
        template="retail"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('contact', field) : undefined}
      />

      {/* Footer */}
      <Footer
        businessName={website.business_name}
        template="retail"
        colorScheme={colorScheme}
      />
    </div>
  );
}