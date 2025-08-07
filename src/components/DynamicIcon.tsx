import React from 'react'
import {
  // Business & Professional
  Briefcase, Building, Users, Target, TrendingUp,
  
  // Food & Restaurant
  Coffee, ChefHat, UtensilsCrossed, Pizza, Cookie, Wine,
  
  // Health & Wellness
  Heart, Stethoscope, Activity, Pill,
  
  // Beauty & Personal Care
  Scissors, Sparkles, Flower,
  
  // Fitness & Sports
  Dumbbell, Bike, Trophy,
  
  // Technology
  Monitor, Smartphone, Wifi, Code, Zap,
  
  // Home & Crafts
  Hammer, Wrench, PaintBucket, Home, TreePine, Drill,
  
  // Automotive
  Car, Truck, Fuel,
  
  // Retail & Shopping
  ShoppingBag, Store, Package, CreditCard,
  
  // Education
  BookOpen, GraduationCap, Lightbulb,
  
  // Communication & Contact
  Phone, Mail, MapPin, Clock,
  
  // General Services
  Shield, Star, Award
} from 'lucide-react'

const iconComponents = {
  // Business & Professional
  Briefcase, Building, Users, Target, TrendingUp,
  
  // Food & Restaurant
  Coffee, ChefHat, UtensilsCrossed, Pizza, Cookie, Wine,
  
  // Health & Wellness
  Heart, Stethoscope, Activity, Pill,
  
  // Beauty & Personal Care
  Scissors, Sparkles, Flower,
  
  // Fitness & Sports
  Dumbbell, Bike, Trophy,
  
  // Technology
  Monitor, Smartphone, Wifi, Code, Zap,
  
  // Home & Crafts
  Hammer, Wrench, PaintBucket, Home, TreePine, Drill,
  
  // Automotive
  Car, Truck, Fuel,
  
  // Retail & Shopping
  ShoppingBag, Store, Package, CreditCard,
  
  // Education
  BookOpen, GraduationCap, Lightbulb,
  
  // Communication & Contact
  Phone, Mail, MapPin, Clock,
  
  // General Services
  Shield, Star, Award
}

interface DynamicIconProps {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
  fallback?: React.ReactNode
}

export default function DynamicIcon({ 
  name, 
  size = 24, 
  className = '', 
  style,
  fallback = <Star size={size} className={className} />
}: DynamicIconProps) {
  const IconComponent = iconComponents[name as keyof typeof iconComponents]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconComponents))
    return <>{fallback}</>
  }
  
  return <IconComponent size={size} className={className} style={style} />
}

// Helper function to check if an icon exists
export function isValidIcon(name: string): boolean {
  return name in iconComponents
}

// Get all available icon names
export function getAvailableIconNames(): string[] {
  return Object.keys(iconComponents)
}