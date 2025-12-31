
import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Zap, 
  Tv, 
  Activity, 
  Home, 
  MoreHorizontal 
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.FOOD]: <Utensils className="w-4 h-4" />,
  [Category.TRANSPORT]: <Car className="w-4 h-4" />,
  [Category.SHOPPING]: <ShoppingBag className="w-4 h-4" />,
  [Category.UTILITIES]: <Zap className="w-4 h-4" />,
  [Category.ENTERTAINMENT]: <Tv className="w-4 h-4" />,
  [Category.HEALTH]: <Activity className="w-4 h-4" />,
  [Category.HOUSING]: <Home className="w-4 h-4" />,
  [Category.OTHERS]: <MoreHorizontal className="w-4 h-4" />,
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.FOOD]: '#f87171', // Red
  [Category.TRANSPORT]: '#60a5fa', // Blue
  [Category.SHOPPING]: '#fbbf24', // Amber
  [Category.UTILITIES]: '#34d399', // Emerald
  [Category.ENTERTAINMENT]: '#a78bfa', // Violet
  [Category.HEALTH]: '#f472b6', // Pink
  [Category.HOUSING]: '#94a3b8', // Slate
  [Category.OTHERS]: '#d1d5db', // Gray
};

export const INITIAL_TRANSACTIONS = [
  {
    id: '1',
    amount: 120.50,
    category: Category.FOOD,
    description: 'Weekly Grocery',
    date: '2023-10-25',
    type: 'expense'
  },
  {
    id: '2',
    amount: 45.00,
    category: Category.TRANSPORT,
    description: 'Gas refill',
    date: '2023-10-24',
    type: 'expense'
  },
  {
    id: '3',
    amount: 3000.00,
    category: Category.OTHERS,
    description: 'Monthly Salary',
    date: '2023-10-01',
    type: 'income'
  }
] as const;
