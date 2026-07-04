import { Category } from '../types';

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  // Income
  salary: {
    label: 'Maaş',
    icon: '💼',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  freelance: {
    label: 'Serbest Çalışma',
    icon: '🖥️',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  investment: {
    label: 'Yatırım',
    icon: '📈',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
  gift: {
    label: 'Hediye',
    icon: '🎁',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  other_income: {
    label: 'Diğer Gelir',
    icon: '💰',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
  },
  // Expense
  food: {
    label: 'Yemek & İçecek',
    icon: '🍔',
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.1)',
  },
  transport: {
    label: 'Ulaşım',
    icon: '🚗',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.1)',
  },
  housing: {
    label: 'Konut & Kira',
    icon: '🏠',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
  },
  health: {
    label: 'Sağlık',
    icon: '💊',
    color: '#14b8a6',
    bgColor: 'rgba(20, 184, 166, 0.1)',
  },
  entertainment: {
    label: 'Eğlence',
    icon: '🎮',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.1)',
  },
  education: {
    label: 'Eğitim',
    icon: '📚',
    color: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.1)',
  },
  shopping: {
    label: 'Alışveriş',
    icon: '🛍️',
    color: '#d946ef',
    bgColor: 'rgba(217, 70, 239, 0.1)',
  },
  bills: {
    label: 'Faturalar',
    icon: '📃',
    color: '#64748b',
    bgColor: 'rgba(100, 116, 139, 0.1)',
  },
  savings: {
    label: 'Tasarruf',
    icon: '🏦',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
  },
  other_expense: {
    label: 'Diğer Gider',
    icon: '📦',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.1)',
  },
};

export const INCOME_CATEGORIES: Category[] = [
  'salary',
  'freelance',
  'investment',
  'gift',
  'other_income',
];

export const EXPENSE_CATEGORIES: Category[] = [
  'food',
  'transport',
  'housing',
  'health',
  'entertainment',
  'education',
  'shopping',
  'bills',
  'savings',
  'other_expense',
];

export const MONTHS_TR = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
];

export const FULL_MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
