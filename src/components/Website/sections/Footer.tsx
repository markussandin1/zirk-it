import React from 'react';
import { TemplateColorScheme } from '../../../types/templates';

interface FooterProps {
  businessName: string;
  template: string;
  colorScheme: TemplateColorScheme;
}

export default function Footer({ businessName, template, colorScheme }: FooterProps) {
  
  const getSectionClasses = () => {
    const baseClasses = "py-8 transition-all duration-300";
    
    switch (template) {
      case 'restaurant':
        return `${baseClasses} bg-amber-800 text-white`;
      case 'retail':
        return `${baseClasses} bg-green-800 text-white`;
      case 'modern_business':
      default:
        return `${baseClasses} bg-gray-800 text-white`;
    }
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getFooterLinks = () => {
    switch (template) {
      case 'restaurant':
        return [
          { label: 'Menu', href: '#services' },
          { label: 'Reservations', href: '#contact' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' }
        ];
      case 'retail':
        return [
          { label: 'Products', href: '#services' },
          { label: 'Shipping', href: '#contact' },
          { label: 'Returns', href: '#contact' },
          { label: 'Support', href: '#contact' }
        ];
      case 'modern_business':
      default:
        return [
          { label: 'Services', href: '#services' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
          { label: 'Privacy', href: '#' }
        ];
    }
  };

  const getSocialLinks = () => {
    // These would typically be dynamic, but for demo purposes we'll show template-appropriate ones
    switch (template) {
      case 'restaurant':
        return [
          { platform: 'Facebook', icon: '📘', href: '#' },
          { platform: 'Instagram', icon: '📷', href: '#' },
          { platform: 'Yelp', icon: '🌟', href: '#' }
        ];
      case 'retail':
        return [
          { platform: 'Instagram', icon: '📷', href: '#' },
          { platform: 'Facebook', icon: '📘', href: '#' },
          { platform: 'Twitter', icon: '🐦', href: '#' }
        ];
      case 'modern_business':
      default:
        return [
          { platform: 'LinkedIn', icon: '💼', href: '#' },
          { platform: 'Twitter', icon: '🐦', href: '#' },
          { platform: 'Facebook', icon: '📘', href: '#' }
        ];
    }
  };

  return (
    <footer className={getSectionClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          
          {/* Business Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{businessName}</h3>
            <p className="text-sm opacity-75 leading-relaxed">
              {template === 'restaurant' && 'Serving authentic flavors and creating memorable dining experiences since day one.'}
              {template === 'retail' && 'Your trusted partner for quality products and exceptional customer service.'}
              {template === 'modern_business' && 'Professional services delivered with expertise, integrity, and excellence.'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {getFooterLinks().map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-sm opacity-75 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="text-md font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {getSocialLinks().map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  title={social.platform}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
            
            {template === 'restaurant' && (
              <div className="mt-4">
                <p className="text-sm opacity-75">📍 Find us on Google Maps</p>
                <p className="text-sm opacity-75">📞 Call for reservations</p>
              </div>
            )}
            
            {template === 'retail' && (
              <div className="mt-4">
                <p className="text-sm opacity-75">🚚 Free shipping over $50</p>
                <p className="text-sm opacity-75">💳 Secure checkout</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
            <p>
              © {getCurrentYear()} {businessName}. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-xs">
                Generated by{' '}
                <span className={`font-medium ${
                  template === 'restaurant' ? 'text-amber-400' :
                  template === 'retail' ? 'text-green-400' :
                  'text-indigo-400'
                }`}>
                  Zirk AI Website Generator
                </span>
              </span>
            </div>
          </div>
          
          {/* Template-specific additional footer content */}
          {template === 'restaurant' && (
            <div className="mt-4 text-center text-xs opacity-50">
              <p>🍕 Made with love and the finest ingredients 🍕</p>
            </div>
          )}
          
          {template === 'retail' && (
            <div className="mt-4 text-center text-xs opacity-50">
              <p>Quality products • Trusted service • Happy customers</p>
            </div>
          )}
          
          {template === 'modern_business' && (
            <div className="mt-4 text-center text-xs opacity-50">
              <p>Professional • Reliable • Results-Driven</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}