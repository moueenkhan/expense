
export enum Category {
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  SHOPPING = 'Shopping',
  UTILITIES = 'Utilities & Bills',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health & Fitness',
  HOUSING = 'Housing',
  OTHERS = 'Others'
}

export enum Currency {
  AED = 'AED',
  PKR = 'PKR'
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  category: Category;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface InsightReport {
  summary: string;
  recommendations: string[];
  savingTips: string[];
}

export type ViewMode = 'monthly' | 'yearly';

export interface DateFilter {
  year: number;
  month: number; // 0-11
  mode: ViewMode;
}

export interface ExchangeSettings {
  aedToPkr: number;
  lastUpdated: string;
}
