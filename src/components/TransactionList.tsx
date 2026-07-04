import React, { useState } from 'react';
import { Trash2, Search, Filter } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { CATEGORY_META, formatCurrency, formatDate } from '../utils/constants';
import type { TransactionType } from '../types';


const TransactionList: React.FC = () => {
  const { filteredTransactions, deleteTransaction } = useBudget();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = filteredTransactions
    .filter((tx) => {
      const matchSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        CATEGORY_META[tx.category].label.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || tx.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.amount - a.amount;
    });

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteTransaction(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="gradient-border">
      {/* Header */}
      <div className="p-5 border-b border-[#1e2d45]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-100 font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Filter size={13} className="text-white" />
            </div>
            İşlemler
            <span className="text-slate-500 text-xs font-normal ml-1">({filtered.length})</span>
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            className="bg-[#0d1427] border border-[#1e2d45] text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-blue-500/50"
          >
            <option value="date">Tarihe Göre</option>
            <option value="amount">Tutara Göre</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İşlem ara..."
              className="w-full bg-[#0d1427] border border-[#1e2d45] focus:border-blue-500/50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'income', 'expense'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  filterType === ft
                    ? ft === 'all'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : ft === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-slate-500 hover:text-slate-300 border border-transparent'
                }`}
              >
                {ft === 'all' ? 'Tümü' : ft === 'income' ? 'Gelir' : 'Gider'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[#1e2d45]/50 max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-400 text-sm">
              {search ? 'Arama sonucu bulunamadı' : 'Bu ay için işlem bulunmuyor'}
            </p>
          </div>
        ) : (
          filtered.map((tx, index) => {
            const meta = CATEGORY_META[tx.category];
            return (
              <div
                key={tx.id}
                className="budget-row flex items-center gap-3 px-5 py-3.5 animate-slide-in group"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: meta.bgColor }}
                >
                  {meta.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ color: meta.color, backgroundColor: meta.bgColor }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-slate-500 text-xs">{formatDate(tx.date)}</span>
                  </div>
                  {tx.note && (
                    <p className="text-slate-500 text-xs mt-0.5 truncate italic">{tx.note}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(tx.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                    confirmDelete === tx.id
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'text-slate-600 hover:text-rose-400 hover:bg-rose-500/10'
                  }`}
                  title={confirmDelete === tx.id ? 'Silmek için tekrar tıkla' : 'Sil'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionList;
