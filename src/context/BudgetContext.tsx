import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Transaction, TransactionType, Category } from '../types';
import { generateId, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface BudgetContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  filteredTransactions: Transaction[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'salary',
    amount: 25000,
    description: 'Aylık Maaş',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  },
  {
    id: '2',
    type: 'income',
    category: 'freelance',
    amount: 8500,
    description: 'Web Projesi',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
  },
  {
    id: '3',
    type: 'expense',
    category: 'housing',
    amount: 7500,
    description: 'Kira',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 3).toISOString().split('T')[0],
  },
  {
    id: '4',
    type: 'expense',
    category: 'food',
    amount: 3200,
    description: 'Market Alışverişi',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString().split('T')[0],
  },
  {
    id: '5',
    type: 'expense',
    category: 'transport',
    amount: 1500,
    description: 'Yakıt & Ulaşım',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
  },
  {
    id: '6',
    type: 'expense',
    category: 'entertainment',
    amount: 950,
    description: 'Netflix, Spotify',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString().split('T')[0],
  },
  {
    id: '7',
    type: 'income',
    category: 'investment',
    amount: 3200,
    description: 'Hisse Senedi Getirisi',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().split('T')[0],
  },
  {
    id: '8',
    type: 'expense',
    category: 'bills',
    amount: 1800,
    description: 'Elektrik, Su, Doğalgaz',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString().split('T')[0],
  },
  {
    id: '9',
    type: 'expense',
    category: 'shopping',
    amount: 2400,
    description: 'Giyim',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString().split('T')[0],
  },
  {
    id: '10',
    type: 'expense',
    category: 'savings',
    amount: 5000,
    description: 'Aylık Tasarruf',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().split('T')[0],
  },
];

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem('smart_budget_transactions');
      return stored ? JSON.parse(stored) : DEMO_TRANSACTIONS;
    } catch {
      return DEMO_TRANSACTIONS;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  useEffect(() => {
    localStorage.setItem('smart_budget_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const filteredTransactions = transactions.filter((tx) => {
    return tx.date.startsWith(selectedMonth);
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = { ...tx, id: generateId() };
      setTransactions((prev) => [newTx, ...prev]);
      addToast(
        tx.type === 'income'
          ? '✅ Gelir başarıyla eklendi'
          : '✅ Gider başarıyla eklendi',
        'success'
      );
    },
    [addToast]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      addToast('🗑️ İşlem silindi', 'info');
    },
    [addToast]
  );

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
        toasts,
        removeToast,
        selectedMonth,
        setSelectedMonth,
        filteredTransactions,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
};
