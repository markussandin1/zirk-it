import React from 'react';
import { TemplateColorScheme } from '../../../types/templates';

interface ServicesProps {
  services: string[];
  template: string;
  colorScheme: TemplateColorScheme;
  isEditable?: boolean;
  onEdit?: (field: string) => void;
}

export default function Services({ 
  services, 
  template, 
  colorScheme, 
  isEditable = false, 
  onEdit 
}: ServicesProps) {
  
  const getSectionClasses = () => {
    const baseClasses = "py-16 transition-all duration-300";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-white`;
      case 'retail':
        return `${baseClasses} bg-${colorScheme.background}`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-white`;
    }
  };

  const getHeadingClasses = () => {
    const baseClasses = `text-3xl font-bold text-${colorScheme.text} mb-4 text-center`;
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} text-4xl text-amber-800`;
      case 'retail':
        return `${baseClasses} text-green-800`;
      case 'modern_business':
      default:
        return `${baseClasses} text-indigo-800`;
    }
  };

  const getSubheadingClasses = () => {
    return `text-lg text-gray-600 mb-12 text-center`;
  };

  const getGridClasses = () => {
    const baseClasses = "grid gap-8";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} md:grid-cols-2 lg:grid-cols-3`;
      case 'retail':
        return `${baseClasses} md:grid-cols-2 lg:grid-cols-4`;
      case 'modern_business':
      default:
        return `${baseClasses} md:grid-cols-3`;
    }
  };

  const getServiceCardClasses = () => {
    const baseClasses = "text-center p-6 rounded-lg transition-all duration-300 hover:transform hover:scale-105";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-gradient-to-b from-amber-50 to-orange-50 hover:shadow-xl border border-amber-100`;
      case 'retail':
        return `${baseClasses} bg-white hover:shadow-lg border border-green-100`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-gray-50 hover:shadow-lg border border-gray-200`;
    }
  };

  const getServiceIcon = (index: number) => {
    switch (template) {
      case 'restaurant':
        const restaurantIcons = ['🍕', '🍝', '🥗', '🍷', '🧄', '🍅'];
        return restaurantIcons[index % restaurantIcons.length];
      
      case 'retail':
        const retailIcons = ['🛍️', '👕', '💎', '🎁', '🌟', '💳'];
        return retailIcons[index % retailIcons.length];
      
      case 'modern_business':
      default:
        return '✨';
    }
  };

  const getServiceTitle = (service: string) => {
    switch (template) {
      case 'restaurant':
        return service;
      case 'retail':
        return service;
      case 'modern_business':
      default:
        return service;
    }
  };

  const getServiceDescription = (service: string) => {
    switch (template) {
      case 'restaurant':
        return `Delicious ${service.toLowerCase()} prepared with the finest ingredients and traditional techniques.`;
      case 'retail':
        return `High-quality ${service.toLowerCase()} with excellent customer service and competitive prices.`;
      case 'modern_business':
      default:
        return `Professional ${service.toLowerCase()} services tailored to your specific needs and requirements.`;
    }
  };

  const getSectionTitle = () => {
    switch (template) {
      case 'restaurant':
        return 'Our Menu';
      case 'retail':
        return 'Our Products';
      case 'modern_business':
      default:
        return 'Our Services';
    }
  };

  const getSectionSubtitle = () => {
    switch (template) {
      case 'restaurant':
        return 'Taste the authentic flavors';
      case 'retail':
        return 'Discover our collection';
      case 'modern_business':
      default:
        return 'What we offer';
    }
  };

  return (
    <section className={getSectionClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={getHeadingClasses()}>
            {getSectionTitle()}
          </h2>
          <p className={getSubheadingClasses()}>
            {getSectionSubtitle()}
          </p>
        </div>
        
        <div className={getGridClasses()}>
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`${getServiceCardClasses()} ${isEditable ? 'cursor-pointer' : ''}`}
              onClick={() => isEditable && onEdit?.(`service-${index}`)}
              title={isEditable ? 'Click to edit this service' : undefined}
            >
              <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-3xl ${
                template === 'restaurant' ? 'bg-amber-100' :
                template === 'retail' ? 'bg-green-100' :
                'bg-indigo-100'
              }`}>
                {getServiceIcon(index)}
              </div>
              
              <h3 className={`text-xl font-semibold mb-2 ${
                template === 'restaurant' ? 'text-amber-800' :
                template === 'retail' ? 'text-green-800' :
                'text-indigo-800'
              }`}>
                {getServiceTitle(service)}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {getServiceDescription(service)}
              </p>
              
              {template === 'retail' && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
              )}
              
              {template === 'restaurant' && (
                <div className="mt-4 flex justify-center">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Template-specific call-to-action */}
        {template === 'restaurant' && (
          <div className="text-center mt-12">
            <button className="inline-block px-8 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors">
              View Full Menu
            </button>
          </div>
        )}
        
        {template === 'retail' && (
          <div className="text-center mt-12">
            <button className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Shop All Products
            </button>
          </div>
        )}
        
        {isEditable && (
          <div className="text-center mt-8">
            <button 
              onClick={() => onEdit?.('add-service')}
              className="inline-block px-6 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg font-medium hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              + Add Service
            </button>
          </div>
        )}
      </div>
    </section>
  );
}