
import React, { useState, useEffect } from 'react';
import { Plus, Bell, Settings, Menu, X, Calendar, ArrowRightLeft } from 'lucide-react';
import { Transaction, DateFilter, ViewMode, Currency, ExchangeSettings } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import InsightPanel from './components/InsightPanel';
import TransactionForm from './components/TransactionForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [exchangeSettings, setExchangeSettings] = useState<ExchangeSettings>(() => {
    const saved = localStorage.getItem('spendwise_exchange');
    return saved ? JSON.parse(saved) : {
      aedToPkr: 76.5,
      lastUpdated: new Date().toISOString()
    };
  });

  const [dateFilter, setDateFilter] = useState<DateFilter>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    mode: 'monthly'
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('spendwise_transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Backwards compatibility: add currency if missing
      return parsed.map((t: any) => ({
        ...t,
        currency: t.currency || Currency.AED
      }));
    }
    return INITIAL_TRANSACTIONS.map(t => ({ ...t, currency: Currency.AED }));
  });

  useEffect(() => {
    localStorage.setItem('spendwise_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spendwise_exchange', JSON.stringify(exchangeSettings));
  }, [exchangeSettings]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([transaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2 text-blue-600">
          <span className="text-xl font-bold tracking-tight">SpendWise AI</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-500"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block fixed inset-0 lg:relative z-40 transition-all duration-300`}>
        <div 
          className="absolute inset-0 bg-black/50 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative h-full">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsMobileMenuOpen(false);
            }} 
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' && 'Financial Overview'}
              {activeTab === 'transactions' && 'All Transactions'}
              {activeTab === 'insights' && 'AI Financial Insights'}
            </h1>
            <div className="flex items-center space-x-2 text-gray-500 text-sm mt-1">
              <span>{dateFilter.mode === 'monthly' ? `${months[dateFilter.month]} ${dateFilter.year}` : `FY ${dateFilter.year}`}</span>
              <span>•</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-[10px] uppercase">Dual Currency</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Indicator / Setter */}
            <div className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm space-x-3">
              <div className="flex items-center space-x-1 text-gray-600">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase">1 AED =</span>
              </div>
              <input 
                type="number" 
                value={exchangeSettings.aedToPkr}
                onChange={(e) => setExchangeSettings({ ...exchangeSettings, aedToPkr: parseFloat(e.target.value), lastUpdated: new Date().toISOString() })}
                className="w-16 bg-blue-50 text-blue-700 font-bold text-sm outline-none px-1 py-0.5 rounded text-center border-none"
              />
              <span className="text-xs font-bold text-gray-600 uppercase">PKR</span>
            </div>

            {/* Period Switcher */}
            <div className="flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
              <button
                onClick={() => setDateFilter(prev => ({ ...prev, mode: 'monthly' }))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  dateFilter.mode === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setDateFilter(prev => ({ ...prev, mode: 'yearly' }))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  dateFilter.mode === 'yearly' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Year
              </button>
            </div>

            {/* Date Picker */}
            <div className="flex items-center space-x-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              {dateFilter.mode === 'monthly' && (
                <select
                  value={dateFilter.month}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                >
                  {months.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
              )}
              <select
                value={dateFilter.year}
                onChange={(e) => setDateFilter(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="bg-transparent text-sm font-medium outline-none cursor-pointer"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add New</span>
            </button>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              filter={dateFilter} 
              exchangeRate={exchangeSettings.aedToPkr} 
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction} 
              filter={dateFilter}
              exchangeRate={exchangeSettings.aedToPkr}
            />
          )}
          {activeTab === 'insights' && (
            <InsightPanel 
              transactions={transactions} 
              exchangeRate={exchangeSettings.aedToPkr}
            />
          )}
        </div>
      </main>

      {isFormOpen && (
        <TransactionForm 
          onAdd={handleAddTransaction} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      <button 
        onClick={() => setIsFormOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-all"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default App;
