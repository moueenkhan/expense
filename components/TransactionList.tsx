
import React, { useState } from 'react';
import { Transaction, Category, DateFilter, Currency } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Search, Trash2, Calendar, ArrowRightLeft } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  filter: DateFilter;
  exchangeRate: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, filter, exchangeRate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAllTime, setShowAllTime] = useState(false);

  const filteredTransactions = transactions
    .filter(t => {
      const d = new Date(t.date);
      const matchesPeriod = showAllTime || (
        filter.mode === 'monthly' 
          ? (d.getFullYear() === filter.year && d.getMonth() === filter.month)
          : (d.getFullYear() === filter.year)
      );
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchesPeriod && matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Transactions</h3>
            <p className="text-sm text-gray-500">
              {showAllTime ? 'Showing all history' : `Showing ${filter.mode === 'monthly' ? months[filter.month] : ''} ${filter.year}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowAllTime(!showAllTime)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showAllTime ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>All History</span>
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount (AED)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount (PKR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((t) => {
              const amountInAED = t.currency === Currency.AED ? t.amount : t.amount / exchangeRate;
              const amountInPKR = t.currency === Currency.PKR ? t.amount : t.amount * exchangeRate;
              
              return (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{t.description}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                        {CATEGORY_ICONS[t.category]}
                      </span>
                      <span className="text-sm text-gray-600">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{amountInAED.toFixed(2)}
                    </span>
                    {t.currency === Currency.AED && <span className="ml-1 text-[10px] bg-blue-50 text-blue-600 px-1 rounded font-bold">Base</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{Math.round(amountInPKR).toLocaleString()}
                    </span>
                    {t.currency === Currency.PKR && <span className="ml-1 text-[10px] bg-blue-50 text-blue-600 px-1 rounded font-bold">Base</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
