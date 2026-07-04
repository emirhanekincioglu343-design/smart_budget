import React, { useEffect, useRef } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBudget();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: { id: string; message: string; type: 'success' | 'error' | 'info' };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.classList.add('toast-enter');
    }
  }, []);

  const colorMap = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    error: 'border-rose-500/30 bg-rose-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
  };

  const iconMap = {
    success: <CheckCircle size={16} className="text-emerald-400" />,
    error: <X size={16} className="text-rose-400" />,
    info: <Info size={16} className="text-blue-400" />,
  };

  return (
    <div
      ref={ref}
      className={`toast-enter pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border glass ${colorMap[toast.type]} min-w-[260px]`}
    >
      {iconMap[toast.type]}
      <span className="text-sm text-slate-200 flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-200 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastContainer;
