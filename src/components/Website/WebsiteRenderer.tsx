import React from 'react';
import { Website } from '../../types';
import { selectTemplateForBusiness, suggestTemplateFromDescription } from '../../utils/templateSelector';
import ModernBusiness from './templates/ModernBusiness';
import Restaurant from './templates/Restaurant';
import Retail from './templates/Retail';

interface WebsiteRendererProps {
  website: Website;
  isEditable?: boolean;
  onEdit?: (section: string, field: string) => void;
}

export default function WebsiteRenderer({ 
  website, 
  isEditable = false, 
  onEdit 
}: WebsiteRendererProps) {
  
  // Determine which template to use
  const getTemplateComponent = () => {
    // TEMPORARY: Force template selection based on business analysis for demo
    let templateId = 'modern_business'; // default
    
    // Try industry-based selection first
    if (website.industry) {
      console.log('WebsiteRenderer: Trying template selection for industry:', website.industry);
      templateId = selectTemplateForBusiness(website.industry, undefined);
      console.log('WebsiteRenderer: Industry-based selection result:', templateId);
    }
    
    // Try description-based selection if we have content
    if (website.content?.hero?.headline) {
      const suggestion = suggestTemplateFromDescription(
        `${website.business_name} ${website.content.hero.headline} ${website.content.about || ''}`
      );
      
      if (suggestion.confidence > 0.6) {
        templateId = suggestion.templateId;
        console.log('WebsiteRenderer: Using description-based template:', templateId, 'confidence:', suggestion.confidence, 'reasoning:', suggestion.reasoning);
      }
    }
    
    // Manual override for common patterns to demonstrate templates
    const businessName = website.business_name?.toLowerCase() || '';
    const industry = website.industry?.toLowerCase() || '';
    const aboutText = website.content?.about?.toLowerCase() || '';
    const combinedText = `${businessName} ${industry} ${aboutText}`;
    
    if (combinedText.includes('restaurant') || combinedText.includes('pizza') || combinedText.includes('food') || 
        combinedText.includes('café') || combinedText.includes('pasta') || combinedText.includes('bella vista')) {
      templateId = 'restaurant';
    } else if (combinedText.includes('boutique') || combinedText.includes('shop') || combinedText.includes('store') || 
               combinedText.includes('retail') || combinedText.includes('clothing') || combinedText.includes('vintage')) {
      templateId = 'retail';
    }

    console.log('WebsiteRenderer: Using template:', templateId, 'for website:', website.business_name, 'industry:', website.industry, 'detected from:', combinedText.substring(0, 100));

    switch (templateId) {
      case 'restaurant':
        return <Restaurant 
          website={website} 
          isEditable={isEditable} 
          onEdit={onEdit} 
        />;
      
      case 'retail':
        return <Retail 
          website={website} 
          isEditable={isEditable} 
          onEdit={onEdit} 
        />;
      
      case 'modern_business':
      default:
        return <ModernBusiness 
          website={website} 
          isEditable={isEditable} 
          onEdit={onEdit} 
        />;
    }
  };

  // Add error boundary logic
  try {
    return (
      <div className="website-renderer">
        {getTemplateComponent()}
      </div>
    );
  } catch (error) {
    console.error('WebsiteRenderer error:', error);
    
    // Fallback to basic display
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {website.business_name}
          </h1>
          <p className="text-gray-600 mb-6">
            There was an error rendering this website template.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Website Content:</h2>
            <div className="text-left space-y-4">
              {website.content?.hero && (
                <div>
                  <h3 className="font-semibold">Headline:</h3>
                  <p>{website.content.hero.headline}</p>
                </div>
              )}
              {website.content?.about && (
                <div>
                  <h3 className="font-semibold">About:</h3>
                  <p>{website.content.about}</p>
                </div>
              )}
              {website.content?.contact && (
                <div>
                  <h3 className="font-semibold">Contact:</h3>
                  <p>Email: {website.content.contact.email}</p>
                  <p>Phone: {website.content.contact.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Export the component as both default and named export for flexibility
export { WebsiteRenderer };