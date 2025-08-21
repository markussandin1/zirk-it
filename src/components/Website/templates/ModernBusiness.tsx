import React from 'react';
import { TemplateProps } from '../../../types/templates';
import { getTemplateById } from '../../../utils/templateSelector';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Services from '../sections/Services';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

export default function ModernBusiness({ website, isEditable = false, onEdit }: TemplateProps) {
  const template = getTemplateById('modern_business');
  
  if (!template) {
    console.error('Modern Business template not found');
    return <div>Template not found</div>;
  }

  const colorScheme = template.colorScheme;
  const { content } = website;

  return (
    <div className="website-container modern-business-template">
      {/* Hero Section */}
      <Hero
        content={content.hero}
        template="modern_business"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('hero', field) : undefined}
      />

      {/* About Section */}
      <About
        content={content.about}
        template="modern_business"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('about', field) : undefined}
      />

      {/* Services Section */}
      <Services
        services={content.servicesList || content.services || []}
        template="modern_business"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('services', field) : undefined}
      />

      {/* Contact Section */}
      <Contact
        contact={content.contact}
        template="modern_business"
        colorScheme={colorScheme}
        isEditable={isEditable}
        onEdit={onEdit ? (field) => onEdit('contact', field) : undefined}
      />

      {/* Footer */}
      <Footer
        businessName={website.business_name}
        template="modern_business"
        colorScheme={colorScheme}
      />
    </div>
  );
}