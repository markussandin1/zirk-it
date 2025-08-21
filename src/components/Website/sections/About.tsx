import React from 'react';
import { TemplateColorScheme } from '../../../types/templates';

interface AboutProps {
  content: string;
  template: string;
  colorScheme: TemplateColorScheme;
  isEditable?: boolean;
  onEdit?: (field: string) => void;
}

export default function About({ 
  content, 
  template, 
  colorScheme, 
  isEditable = false, 
  onEdit 
}: AboutProps) {
  
  const getSectionClasses = () => {
    const baseClasses = "py-16 transition-all duration-300";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-${colorScheme.background} relative`;
      case 'retail':
        return `${baseClasses} bg-white relative`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-${colorScheme.background}`;
    }
  };

  const getHeadingClasses = () => {
    const baseClasses = `text-3xl font-bold text-${colorScheme.text} mb-6`;
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} text-center text-4xl`;
      case 'retail':
        return `${baseClasses} text-center text-3xl`;
      case 'modern_business':
      default:
        return `${baseClasses} text-center`;
    }
  };

  const getContentClasses = () => {
    const baseClasses = `text-${colorScheme.text}/80 leading-relaxed`;
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} text-lg text-center max-w-4xl mx-auto`;
      case 'retail':
        return `${baseClasses} text-base max-w-3xl mx-auto text-center`;
      case 'modern_business':
      default:
        return `${baseClasses} text-lg max-w-3xl mx-auto text-center`;
    }
  };

  const renderDecorations = () => {
    if (template === 'restaurant') {
      return (
        <>
          <div className="absolute top-8 left-8 w-16 h-16 border-4 border-amber-300/30 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 border-4 border-orange-300/30 rounded-full"></div>
          <div className="absolute top-1/2 left-4 w-8 h-8 bg-yellow-400/20 rounded-full transform -translate-y-1/2"></div>
        </>
      );
    }
    
    if (template === 'retail') {
      return (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-green-500 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-teal-500 to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <section className={getSectionClasses()}>
      {renderDecorations()}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={getHeadingClasses()}>
          About Us
        </h2>
        
        <div 
          className={`${getContentClasses()} ${isEditable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={() => isEditable && onEdit?.('about')}
          title={isEditable ? 'Click to edit about section' : undefined}
        >
          <p>{content}</p>
        </div>
        
        {/* Template-specific additional content */}
        {template === 'restaurant' && (
          <div className="mt-12 flex justify-center space-x-8 text-amber-600">
            <div className="text-center">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm opacity-75">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm opacity-75">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-75">Satisfaction</div>
            </div>
          </div>
        )}
        
        {template === 'retail' && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full">
              <span className="text-sm font-medium">🌟 Trusted by thousands of customers</span>
            </div>
          </div>
        )}
        
        {template === 'modern_business' && (
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-indigo-100 text-indigo-800 rounded-full">
              <span className="text-sm font-medium">Professional • Reliable • Results-Driven</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}