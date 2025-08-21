import React from 'react';
import { TemplateProps } from '../../../types/templates';
import { getTemplateById } from '../../../utils/templateSelector';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Services from '../sections/Services';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

export default function Restaurant({ website, isEditable = false, onEdit }: TemplateProps) {
  const template = getTemplateById('restaurant');
  
  if (!template) {
    console.error('Restaurant template not found');
    return <div>Template not found</div>;
  }

  const colorScheme = template.colorScheme;
  const { content } = website;

  return (
    <div className="website-container restaurant-template">
      {/* Hero Section - Full height for restaurants */}
      <Hero
        content={content.hero}
        template="restaurant"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('hero', field) : undefined}
      />

      {/* About Section */}
      <About
        content={content.about}
        template="restaurant"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('about', field) : undefined}
      />

      {/* Gallery Section (Restaurant-specific) */}
      {content.gallery && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-800 mb-4">Our Gallery</h2>
              <p className="text-lg text-gray-600">A glimpse into our culinary world</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {content.gallery.images?.slice(0, 6).map((image, index) => (
                <div key={index} className="aspect-square bg-amber-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🍽️
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu/Services Section */}
      <Services
        services={content.servicesList || content.services || []}
        template="restaurant"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('services', field) : undefined}
      />

      {/* Special Offers Section (Restaurant-specific) */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Special Offers</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-200">
              <h3 className="text-xl font-semibold text-amber-700 mb-3">Happy Hour</h3>
              <p className="text-gray-600 mb-4">Monday - Friday, 4 PM - 7 PM</p>
              <p className="text-2xl font-bold text-amber-600">50% OFF</p>
              <p className="text-sm text-gray-500">Selected appetizers and drinks</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-200">
              <h3 className="text-xl font-semibold text-amber-700 mb-3">Family Deal</h3>
              <p className="text-gray-600 mb-4">Perfect for families of 4+</p>
              <p className="text-2xl font-bold text-amber-600">25% OFF</p>
              <p className="text-sm text-gray-500">Family meals and desserts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact
        contact={content.contact}
        template="restaurant"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('contact', field) : undefined}
      />

      {/* Footer */}
      <Footer
        businessName={website.business_name}
        template="restaurant"
        colorScheme={colorScheme}
      />
    </div>
  );
}