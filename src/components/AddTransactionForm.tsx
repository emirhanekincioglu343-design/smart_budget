import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import type { TransactionType, Category } from '../types';
import { CATEGORY_META, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';

const AddTransactionForm: React.FC = () => {
  const { addTransaction } = useBudget();
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState<Category>('salary');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Geçerli bir tutar girin';
    if (!description.trim()) newErrors.description = 'Açıklama gerekli';
    if (!date) newErrors.date = 'Tarih seçin';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      type,
      category,
      amount: parseFloat(amount),
      description: description.trim(),
      note: note.trim() || undefined,
      date,
    });

    setAmount('');
    setDescription('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'salary' : 'food');
    setErrors({});
  };

  return (
    <div
      style={{
        background: '#111827',
        borderRadius: '16px',
        border: '1px solid rgba(59,130,246,0.2)',
        padding: '20px',
      }}
    >
      <h3 style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: 24, height: 24, borderRadius: 8,
          background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Plus size={14} color="white" />
        </span>
        Yeni İşlem Ekle
      </h3>

      {/* Type toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, padding: 4, background: '#0d1427', borderRadius: 12 }}>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          style={{
            flex: 1, padding: '8px 16px', borderRadius: 10,
            border: type === 'income' ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
            background: type === 'income' ? 'rgba(16,185,129,0.15)' : 'transparent',
            color: type === 'income' ? '#34d399' : '#94a3b8',
            fontWeight: 500, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📈 Gelir
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          style={{
            flex: 1, padding: '8px 16px', borderRadius: 10,
            border: type === 'expense' ? '1px solid rgba(244,63,94,0.4)' : '1px solid transparent',
            background: type === 'expense' ? 'rgba(244,63,94,0.15)' : 'transparent',
            color: type === 'expense' ? '#fb7185' : '#94a3b8',
            fontWeight: 500, fontSize: 14, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📉 Gider
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Category */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            Kategori
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 10px', borderRadius: 10,
                    border: isSelected ? '1px solid rgba(59,130,246,0.5)' : '1px solid #1e2d45',
                    background: isSelected ? meta.bgColor : 'transparent',
                    color: isSelected ? '#93c5fd' : '#94a3b8',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.2s', textAlign: 'left',
                  }}
                >
                  <span>{meta.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            Tutar (₺)
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>
              ₺
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
              }}
              placeholder="0.00"
              step="0.01"
              min="0"
              style={{
                width: '100%', background: '#0d1427',
                border: errors.amount ? '1px solid rgba(244,63,94,0.5)' : '1px solid #1e2d45',
                borderRadius: 10, padding: '10px 12px 10px 32px',
                color: '#f1f5f9', fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
              onBlur={e => e.target.style.borderColor = errors.amount ? 'rgba(244,63,94,0.5)' : '#1e2d45'}
            />
          </div>
          {errors.amount && <p style={{ color: '#fb7185', fontSize: 11, marginTop: 4 }}>{errors.amount}</p>}
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            Açıklama
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            placeholder="İşlem açıklaması..."
            style={{
              width: '100%', background: '#0d1427',
              border: errors.description ? '1px solid rgba(244,63,94,0.5)' : '1px solid #1e2d45',
              borderRadius: 10, padding: '10px 12px',
              color: '#f1f5f9', fontSize: 14, outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
            onBlur={e => e.target.style.borderColor = errors.description ? 'rgba(244,63,94,0.5)' : '#1e2d45'}
          />
          {errors.description && <p style={{ color: '#fb7185', fontSize: 11, marginTop: 4 }}>{errors.description}</p>}
        </div>

        {/* Date */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            Tarih
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: '100%', background: '#0d1427',
              border: '1px solid #1e2d45', borderRadius: 10,
              padding: '10px 12px', color: '#f1f5f9',
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
              colorScheme: 'dark',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
            onBlur={e => e.target.style.borderColor = '#1e2d45'}
          />
        </div>

        {/* Note */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
            Not <span style={{ color: '#475569' }}>(isteğe bağlı)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ek not..."
            rows={2}
            style={{
              width: '100%', background: '#0d1427',
              border: '1px solid #1e2d45', borderRadius: 10,
              padding: '10px 12px', color: '#f1f5f9',
              fontSize: 14, outline: 'none', resize: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
            onBlur={e => e.target.style.borderColor = '#1e2d45'}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%', padding: '12px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: 14,
            background: type === 'income'
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #e11d48, #f43f5e)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'opacity 0.2s, transform 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Plus size={16} />
          {type === 'income' ? 'Gelir Ekle' : 'Gider Ekle'}
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
