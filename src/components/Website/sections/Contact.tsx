import React from 'react';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { WebsiteContent, TemplateColorScheme } from '../../../types/templates';

interface ContactProps {
  contact: WebsiteContent['contact'];
  template: string;
  colorScheme: TemplateColorScheme;
  isEditable?: boolean;
  onEdit?: (field: string) => void;
}

export default function Contact({ 
  contact, 
  template, 
  colorScheme, 
  isEditable = false, 
  onEdit 
}: ContactProps) {
  
  const getSectionClasses = () => {
    const baseClasses = "py-16 transition-all duration-300";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-gradient-to-b from-amber-900 to-orange-900 text-white`;
      case 'retail':
        return `${baseClasses} bg-gradient-to-b from-green-900 to-emerald-900 text-white`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-gradient-to-b from-gray-900 to-slate-900 text-white`;
    }
  };

  const getHeadingClasses = () => {
    return "text-3xl font-bold mb-4 text-center";
  };

  const getSubheadingClasses = () => {
    return "text-lg opacity-90 mb-12 text-center";
  };

  const getGridClasses = () => {
    return "grid md:grid-cols-3 gap-8 text-center";
  };

  const getContactItemClasses = () => {
    const baseClasses = "flex flex-col items-center p-6 rounded-lg transition-all duration-300";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-white/10 backdrop-blur-sm hover:bg-white/20`;
      case 'retail':
        return `${baseClasses} bg-white/10 backdrop-blur-sm hover:bg-white/20`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-white/10 backdrop-blur-sm hover:bg-white/20`;
    }
  };

  const getIconColor = () => {
    switch (template) {
      case 'restaurant':
        return 'text-amber-400';
      case 'retail':
        return 'text-green-400';
      case 'modern_business':
      default:
        return 'text-indigo-400';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Simple phone formatting - could be enhanced
    return phone;
  };

  const formatEmail = (email: string) => {
    return email;
  };

  const formatAddress = (address: string) => {
    return address;
  };

  const getBusinessHours = () => {
    switch (template) {
      case 'restaurant':
        return [
          { day: 'Monday - Thursday', hours: '11:00 AM - 10:00 PM' },
          { day: 'Friday - Saturday', hours: '11:00 AM - 11:00 PM' },
          { day: 'Sunday', hours: '12:00 PM - 9:00 PM' }
        ];
      case 'retail':
        return [
          { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
          { day: 'Saturday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Sunday', hours: '11:00 AM - 5:00 PM' }
        ];
      case 'modern_business':
      default:
        return [
          { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
          { day: 'Sunday', hours: 'Closed' }
        ];
    }
  };

  return (
    <section className={getSectionClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={getHeadingClasses()}>
            Get In Touch
          </h2>
          <p className={getSubheadingClasses()}>
            {template === 'restaurant' ? 'Visit us today for an unforgettable dining experience' :
             template === 'retail' ? 'Contact us for the best shopping experience' :
             'Contact us today for professional service'}
          </p>
        </div>
        
        <div className={getGridClasses()}>
          {/* Phone */}
          <div className={getContactItemClasses()}>
            <Phone className={`h-8 w-8 mb-4 ${getIconColor()}`} />
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p 
              className={`opacity-90 ${isEditable ? 'cursor-pointer hover:opacity-100' : ''}`}
              onClick={() => isEditable && onEdit?.('phone')}
              title={isEditable ? 'Click to edit phone number' : undefined}
            >
              {formatPhoneNumber(contact.phone)}
            </p>
            {template === 'restaurant' && (
              <p className="text-sm opacity-75 mt-2">Call for reservations</p>
            )}
          </div>
          
          {/* Email */}
          <div className={getContactItemClasses()}>
            <Mail className={`h-8 w-8 mb-4 ${getIconColor()}`} />
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p 
              className={`opacity-90 break-all ${isEditable ? 'cursor-pointer hover:opacity-100' : ''}`}
              onClick={() => isEditable && onEdit?.('email')}
              title={isEditable ? 'Click to edit email address' : undefined}
            >
              {formatEmail(contact.email)}
            </p>
            {template === 'retail' && (
              <p className="text-sm opacity-75 mt-2">For inquiries & support</p>
            )}
          </div>
          
          {/* Address */}
          <div className={getContactItemClasses()}>
            <MapPin className={`h-8 w-8 mb-4 ${getIconColor()}`} />
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p 
              className={`opacity-90 ${isEditable ? 'cursor-pointer hover:opacity-100' : ''}`}
              onClick={() => isEditable && onEdit?.('address')}
              title={isEditable ? 'Click to edit address' : undefined}
            >
              {formatAddress(contact.address)}
            </p>
            {template === 'modern_business' && (
              <p className="text-sm opacity-75 mt-2">Visit our office</p>
            )}
          </div>
        </div>
        
        {/* Business Hours Section */}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16">
            
            {/* Hours */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Clock className={`h-6 w-6 mr-2 ${getIconColor()}`} />
                <h3 className="text-xl font-semibold">Business Hours</h3>
              </div>
              <div className="space-y-2">
                {getBusinessHours().map((hours, index) => (
                  <div key={index} className="flex justify-between text-sm opacity-90">
                    <span className="font-medium">{hours.day}:</span>
                    <span className="ml-4">{hours.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Info */}
            {template === 'restaurant' && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 mr-2 text-amber-400" />
                  <h3 className="text-xl font-semibold">Rating</h3>
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm opacity-90">4.9/5 from 200+ reviews</p>
              </div>
            )}
            
            {template === 'retail' && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Why Choose Us?</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>✓ Free shipping on orders over $50</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Expert customer support</p>
                </div>
              </div>
            )}
            
            {template === 'modern_business' && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Get Started</h3>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Schedule Consultation
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Emergency Contact for specific templates */}
        {template === 'modern_business' && (
          <div className="mt-12 text-center">
            <p className="text-sm opacity-75">
              Need immediate assistance? Call our 24/7 hotline: 
              <span className="font-semibold ml-1">{contact.phone}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}