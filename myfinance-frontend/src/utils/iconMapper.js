import React from 'react';
import {
  // Finance & Money Icons
  Wallet,
  CreditCard,
  DollarSign,
  Banknote,
  Receipt,
  Coins,
  PiggyBank,

  // Food & Dining
  Coffee,
  Utensils,
  IceCream,
  Pizza,

  // Transportation
  Car,
  Bus,
  Bike,
  Fuel,
  Plane,
  Train,

  // Shopping & Entertainment
  ShoppingBag,
  ShoppingCart,
  Gift,
  Ticket,
  Movie,
  Game,
  Music,

  // Home & Utilities
  Home,
  Zap,
  Water,
  Wifi,
  Phone,
  Smartphone,

  // Health & Fitness
  Heart,
  Pill,
  Dumbbell,
  Activity,

  // Education & Work
  GraduationCap,
  Book,
  Briefcase,
  Laptop,

  // Lifestyle
  Shirt,
  Sparkles,
  Paintbrush,

  // Travel & Vacation
  Camera,

  // Pets & Animals
  Pet,
  Cat,

  // Other
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  File,
  Folder,
  Tag,
  Star
} from '../components/icons';

/**
 * Icon name to Lucide React component mapping
 * Maps icon name strings (from backend) to actual Lucide React icon components
 */
const iconMap = {
  // Finance & Money
  'Wallet': Wallet,
  'CreditCard': CreditCard,
  'DollarSign': DollarSign,
  'Banknote': Banknote,
  'Receipt': Receipt,
  'Coins': Coins,
  'PiggyBank': PiggyBank,

  // Food & Dining
  'Coffee': Coffee,
  'Utensils': Utensils,
  'UtensilsCrossed': Utensils, // Alias for backend compatibility
  'IceCream': IceCream,
  'Pizza': Pizza,

  // Transportation
  'Car': Car,
  'Bus': Bus,
  'Bike': Bike,
  'Fuel': Fuel,
  'Plane': Plane,
  'Train': Train,

  // Shopping & Entertainment
  'ShoppingBag': ShoppingBag,
  'ShoppingCart': ShoppingCart,
  'Gift': Gift,
  'Ticket': Ticket,
  'Movie': Movie,
  'Film': Movie, // Alias for backend compatibility
  'Game': Game,
  'Gamepad2': Game, // Alias for backend compatibility
  'Music': Music,

  // Home & Utilities
  'Home': Home,
  'Zap': Zap,
  'Water': Water,
  'Droplet': Water, // Alias for backend compatibility
  'Wifi': Wifi,
  'Phone': Phone,
  'Smartphone': Smartphone,

  // Health & Fitness
  'Heart': Heart,
  'Pill': Pill,
  'Dumbbell': Dumbbell,
  'Activity': Activity,

  // Education & Work
  'GraduationCap': GraduationCap,
  'Book': Book,
  'Briefcase': Briefcase,
  'Laptop': Laptop,

  // Lifestyle
  'Shirt': Shirt,
  'Sparkles': Sparkles,
  'Paintbrush': Paintbrush,

  // Travel & Vacation
  'Camera': Camera,

  // Pets & Animals
  'Pet': Pet,
  'Dog': Pet, // Alias for backend compatibility
  'Cat': Cat,

  // Other
  'TrendingUp': TrendingUp,
  'TrendingDown': TrendingDown,
  'Plus': Plus,
  'Minus': Minus,
  'File': File,
  'Folder': Folder,
  'Tag': Tag,
  'Star': Star
};

/**
 * Get Lucide React icon component from icon name string
 * @param {string} iconName - Icon name from backend (e.g., "Coffee", "Car", "Wallet")
 * @param {string} className - Optional CSS classes to apply to the icon
 * @param {object} props - Additional props to pass to the icon component
 * @returns {JSX.Element} Lucide React icon component or fallback Folder icon
 */
export const getIconComponent = (iconName, className = '', props = {}) => {
  if (!iconName) {
    // Default fallback icon
    return <Folder className={className} {...props} />;
  }

  const IconComponent = iconMap[iconName];

  if (IconComponent) {
    return <IconComponent className={className} {...props} />;
  }

  // Fallback to Folder icon if icon name not found
  return <Folder className={className} {...props} />;
};

/**
 * Check if an icon name exists in the icon map
 * @param {string} iconName - Icon name to check
 * @returns {boolean} True if icon exists, false otherwise
 */
export const hasIcon = (iconName) => {
  return iconName && iconMap.hasOwnProperty(iconName);
};

export default getIconComponent;
