import React, { useState } from 'react';
import { Wallet, BarChart2, List, PlusCircle, Sparkles } from 'lucide-react';

import { BudgetProvider } from './context/BudgetContext';
import StatsBar from './components/StatsBar';
import AddTransactionForm from './components/AddTransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import ToastContainer from './components/ToastContainer';

type Tab = 'dashboard' | 'transactions' | 'add';

const Sidebar: React.FC<{ activeTab: Tab; onTabChange: (t: Tab) => void }> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <BarChart2 size={18} />, label: 'Dashboard' },
    { id: 'transactions', icon: <List size={18} />, label: 'İşlemler' },
    { id: 'add', icon: <PlusCircle size={18} />, label: 'Ekle' },
  ];

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-[#1e2d45]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-slate-100 font-bold text-sm leading-tight">Akıllı Bütçe</h1>
            <p className="text-slate-500 text-xs">Finansal Analizör</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-blue-600/20 to-violet-600/20 text-blue-300 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2235]'
            }`}
          >
            <span className={activeTab === item.id ? 'text-blue-400' : ''}>{item.icon}</span>
            {item.label}
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1e2d45]">
        <div className="bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={13} className="text-violet-400" />
            <p className="text-slate-300 text-xs font-medium">Pro İpucu</p>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Tasarruf oranınızı %20'nin üzerinde tutmayı hedefleyin.
          </p>
        </div>
      </div>
    </aside>
  );
};

const MobileNav: React.FC<{ activeTab: Tab; onTabChange: (t: Tab) => void }> = ({
  activeTab,
  onTabChange,
}) => {
  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <BarChart2 size={20} />, label: 'Dashboard' },
    { id: 'transactions', icon: <List size={20} />, label: 'İşlemler' },
    { id: 'add', icon: <PlusCircle size={20} />, label: 'Ekle' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-[#1e2d45] lg:hidden">
      <div className="flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200 ${
              activeTab === item.id ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-grid text-slate-100 flex">
        {/* Sidebar — desktop */}
        <div className="hidden lg:flex border-r border-[#1e2d45] bg-[#0d1427]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {/* Top gradient blob */}
          <div className="fixed top-0 left-0 right-0 h-80 pointer-events-none z-0">
            <div className="absolute top-[-100px] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-3xl" />
            <div className="absolute top-[-50px] right-[10%] w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-3xl" />
          </div>

          <div className="relative z-10 p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <h1 className="gradient-text text-lg font-bold">Akıllı Bütçe</h1>
            </div>

            {/* Stats always visible */}
            <StatsBar />

            {/* Tabs */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in-up">
                <Charts />
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="animate-fade-in-up">
                <TransactionList />
              </div>
            )}

            {activeTab === 'add' && (
              <div className="animate-fade-in-up max-w-lg">
                <AddTransactionForm />
              </div>
            )}

            {/* Desktop: dashboard shows both */}
            {activeTab === 'dashboard' && (
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 animate-fade-in-up">
                <div className="lg:col-span-2">
                  <TransactionList />
                </div>
                <div>
                  <AddTransactionForm />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Mobile nav */}
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Toast */}
        <ToastContainer />
      </div>
    </BudgetProvider>
  );
}

export default App;
