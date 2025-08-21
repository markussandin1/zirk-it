import React from 'react';
import { WebsiteContent, TemplateColorScheme } from '../../../types/templates';

interface HeroProps {
  content: WebsiteContent['hero'];
  template: string;
  colorScheme: TemplateColorScheme;
  isEditable?: boolean;
  onEdit?: (field: string) => void;
}

export default function Hero({ 
  content, 
  template, 
  colorScheme, 
  isEditable = false, 
  onEdit 
}: HeroProps) {
  
  const getTemplateClasses = () => {
    const baseClasses = "text-white transition-all duration-300";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-gradient-to-r from-orange-600 to-red-600 min-h-screen flex items-center relative overflow-hidden`;
      
      case 'retail':
        return `${baseClasses} bg-gradient-to-br from-green-600 via-teal-500 to-emerald-600 py-24 relative`;
      
      case 'modern_business':
      default:
        return `${baseClasses} bg-gradient-to-r from-indigo-600 to-purple-600 py-20 relative`;
    }
  };

  const getHeadingClasses = () => {
    const baseClasses = "font-bold mb-6 leading-tight";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} text-5xl md:text-7xl lg:text-8xl`;
      case 'retail':
        return `${baseClasses} text-4xl md:text-6xl lg:text-7xl`;
      case 'modern_business':
      default:
        return `${baseClasses} text-4xl md:text-6xl lg:text-6xl`;
    }
  };

  const getSubheadingClasses = () => {
    const baseClasses = "mb-8 opacity-90 leading-relaxed";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} text-2xl md:text-3xl lg:text-4xl`;
      case 'retail':
        return `${baseClasses} text-xl md:text-2xl lg:text-3xl`;
      case 'modern_business':
      default:
        return `${baseClasses} text-xl md:text-2xl lg:text-2xl`;
    }
  };

  const getCtaClasses = () => {
    const baseClasses = "inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-white text-orange-600 hover:bg-gray-100 shadow-xl`;
      case 'retail':
        return `${baseClasses} bg-white text-green-600 hover:bg-gray-100 border-2 border-white`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-white text-indigo-600 hover:bg-gray-100`;
    }
  };

  const renderBackgroundPattern = () => {
    if (template === 'restaurant') {
      return (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white"></div>
        </div>
      );
    }
    
    if (template === 'retail') {
      return (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-white"></div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <section className={getTemplateClasses()}>
      {renderBackgroundPattern()}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          className={`${getHeadingClasses()} ${isEditable ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={() => isEditable && onEdit?.('headline')}
          title={isEditable ? 'Click to edit headline' : undefined}
        >
          {content.headline}
        </h1>
        
        <p 
          className={`${getSubheadingClasses()} ${isEditable ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={() => isEditable && onEdit?.('subheadline')}
          title={isEditable ? 'Click to edit description' : undefined}
        >
          {content.subheadline}
        </p>
        
        <button 
          className={getCtaClasses()}
          onClick={() => isEditable && onEdit?.('ctaText')}
          title={isEditable ? 'Click to edit button text' : undefined}
        >
          {content.ctaText}
        </button>
      </div>
      
      {/* Template-specific decorative elements */}
      {template === 'restaurant' && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      )}
      
      {template === 'retail' && (
        <div className="absolute top-4 right-4 text-white/20 text-8xl font-bold transform rotate-12">
          NEW
        </div>
      )}
    </section>
  );
}