import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/constants';

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  glowColor: string;
  subtitle?: string;
  valueColor: string;
}> = ({ title, value, icon, iconBg, glowColor, subtitle, valueColor }) => {
  return (
    <div
      style={{
        background: '#111827',
        borderRadius: 16,
        border: '1px solid #1e2d45',
        padding: '18px 20px',
        boxShadow: glowColor,
        transition: 'transform 0.2s, border-color 0.2s',
        cursor: 'default',
        position: 'relative',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(59,130,246,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#1e2d45';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            {title}
          </p>
          <p style={{ color: valueColor, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </p>
          {subtitle && <p style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{subtitle}</p>}
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatsBar: React.FC = () => {
  const { totalIncome, totalExpense, balance, selectedMonth, setSelectedMonth } = useBudget();

  const savingsRate = totalIncome > 0
    ? ((balance / totalIncome) * 100).toFixed(1)
    : '0.0';

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, margin: 0 }}>Özet</h2>
          <p style={{ color: '#475569', fontSize: 12, margin: '2px 0 0' }}>Seçili aya ait istatistikler</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            background: '#1a2235', border: '1px solid #1e2d45',
            color: '#e2e8f0', fontSize: 13, borderRadius: 10,
            padding: '8px 12px', outline: 'none', cursor: 'pointer',
          }}
        >
          {getMonthOptions().map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="stats-grid">
        <StatCard
          title="Toplam Gelir"
          value={formatCurrency(totalIncome)}
          valueColor="#34d399"
          icon={<TrendingUp size={18} color="#34d399" />}
          iconBg="rgba(16,185,129,0.12)"
          glowColor="0 0 20px rgba(16,185,129,0.1)"
        />
        <StatCard
          title="Toplam Gider"
          value={formatCurrency(totalExpense)}
          valueColor="#fb7185"
          icon={<TrendingDown size={18} color="#fb7185" />}
          iconBg="rgba(244,63,94,0.12)"
          glowColor="0 0 20px rgba(244,63,94,0.1)"
        />
        <StatCard
          title="Net Bakiye"
          value={formatCurrency(balance)}
          valueColor={balance >= 0 ? '#34d399' : '#fb7185'}
          icon={<Scale size={18} color={balance >= 0 ? '#34d399' : '#fb7185'} />}
          iconBg={balance >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'}
          glowColor="0 0 20px rgba(59,130,246,0.1)"
        />
        <StatCard
          title="Tasarruf Oranı"
          value={`%${savingsRate}`}
          valueColor="#a78bfa"
          icon={<Wallet size={18} color="#a78bfa" />}
          iconBg="rgba(139,92,246,0.12)"
          glowColor="0 0 20px rgba(139,92,246,0.1)"
          subtitle="Gelirin yüzdesi"
        />
      </div>
    </div>
  );
};

export default StatsBar;
