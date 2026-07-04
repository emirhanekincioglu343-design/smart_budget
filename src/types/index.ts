export type TransactionType = 'income' | 'expense';

export type Category =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other_income'
  | 'food'
  | 'transport'
  | 'housing'
  | 'health'
  | 'entertainment'
  | 'education'
  | 'shopping'
  | 'bills'
  | 'savings'
  | 'other_expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  note?: string;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryStats {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}
