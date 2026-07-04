import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { CATEGORY_META, MONTHS_TR, formatCurrency } from '../utils/constants';
import type { Transaction } from '../types';


// ─── Custom Tooltip ────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-[#1e2d45]">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-slate-100 font-semibold">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-[#1e2d45]">
      <p className="text-slate-200 text-sm font-semibold">{payload[0].name}</p>
      <p className="text-slate-400 text-xs mt-1">
        {formatCurrency(payload[0].value)} · {payload[0].payload.percentage}%
      </p>
    </div>
  );
};

// ─── Monthly Trend Chart ────────────────────────────────────────────────
const MonthlyTrendChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const data = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthTxs = transactions.filter((tx) => tx.date.startsWith(monthKey));
      const income = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month: MONTHS_TR[d.getMonth()], income, expense };
    });
  }, [transactions]);

  return (
    <div className="gradient-border p-5">
      <h4 className="text-slate-100 font-semibold text-sm mb-4">📊 Aylık Trend (Son 6 Ay)</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" name="Gelir" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }} />
          <Area type="monotone" dataKey="expense" name="Gider" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={{ fill: '#f43f5e', strokeWidth: 0, r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ─── Expense Breakdown (Pie) ────────────────────────────────────────────
const ExpenseBreakdownChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const data = useMemo(() => {
    const expenses = transactions.filter((tx) => tx.type === 'expense');
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const grouped: Record<string, number> = {};
    expenses.forEach((tx) => {
      grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount;
    });
    return Object.entries(grouped)
      .map(([cat, amount]) => ({
        name: CATEGORY_META[cat as keyof typeof CATEGORY_META]?.label || cat,
        value: amount,
        color: CATEGORY_META[cat as keyof typeof CATEGORY_META]?.color || '#64748b',
        percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="gradient-border p-5 flex items-center justify-center h-[280px]">
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-slate-500 text-sm">Gider verisi yok</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-border p-5">
      <h4 className="text-slate-100 font-semibold text-sm mb-4">🥧 Gider Dağılımı</h4>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto max-h-[160px] pr-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 text-xs truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-slate-300 text-xs font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Budget Progress ────────────────────────────────────────────────────
const BUDGET_LIMITS: Partial<Record<string, number>> = {
  food: 4000,
  transport: 2000,
  housing: 8000,
  entertainment: 1500,
  shopping: 3000,
  bills: 2500,
};

const BudgetProgress: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const expenseByCategory = useMemo(() => {
    const result: Record<string, number> = {};
    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        result[tx.category] = (result[tx.category] || 0) + tx.amount;
      });
    return result;
  }, [transactions]);

  return (
    <div className="gradient-border p-5">
      <h4 className="text-slate-100 font-semibold text-sm mb-4">🎯 Bütçe Limitleri</h4>
      <div className="space-y-3">
        {Object.entries(BUDGET_LIMITS).map(([cat, limit]) => {
          const spent = expenseByCategory[cat] || 0;
          const pct = Math.min((spent / limit!) * 100, 100);
          const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META];
          const isOver = spent > limit!;
          const isWarning = pct > 80 && !isOver;

          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{meta?.icon}</span>
                  <span className="text-slate-300 text-xs font-medium">{meta?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${isOver ? 'text-rose-400' : 'text-slate-300'}`}>
                    {formatCurrency(spent)}
                  </span>
                  <span className="text-slate-600 text-xs">/ {formatCurrency(limit!)}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#1a2235] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isOver ? '#f43f5e' : isWarning ? '#f59e0b' : meta?.color || '#3b82f6',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Charts Component ──────────────────────────────────────────────
const Charts: React.FC = () => {
  const { transactions, filteredTransactions } = useBudget();

  return (
    <div className="space-y-4">
      <MonthlyTrendChart transactions={transactions} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpenseBreakdownChart transactions={filteredTransactions} />
        <BudgetProgress transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Charts;
