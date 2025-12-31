
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Transaction, Category, DateFilter, Currency } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  filter: DateFilter;
  exchangeRate: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, filter, exchangeRate }) => {
  const stats = useMemo(() => {
    const convertToAED = (t: Transaction) => t.currency === Currency.AED ? t.amount : t.amount / exchangeRate;

    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      if (filter.mode === 'monthly') {
        return d.getFullYear() === filter.year && d.getMonth() === filter.month;
      } else {
        return d.getFullYear() === filter.year;
      }
    });

    const totalIncomeAED = filtered
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + convertToAED(t), 0);
    
    const totalExpensesAED = filtered
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + convertToAED(t), 0);

    const balanceAED = totalIncomeAED - totalExpensesAED;

    const categoryData = Object.values(Category).map(cat => {
      const amount = filtered
        .filter(t => t.type === 'expense' && t.category === cat)
        .reduce((acc, t) => acc + convertToAED(t), 0);
      return { name: cat, value: amount };
    }).filter(item => item.value > 0);

    let trendData: any[] = [];
    if (filter.mode === 'monthly') {
      const daily: Record<number, { date: string, expense: number, income: number }> = {};
      const daysInMonth = new Date(filter.year, filter.month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        daily[i] = { date: i.toString(), expense: 0, income: 0 };
      }
      filtered.forEach(t => {
        const day = new Date(t.date).getDate();
        const amt = convertToAED(t);
        if (t.type === 'expense') daily[day].expense += amt;
        else daily[day].income += amt;
      });
      trendData = Object.values(daily);
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthly = months.map(m => ({ date: m, expense: 0, income: 0 }));
      filtered.forEach(t => {
        const monthIdx = new Date(t.date).getMonth();
        const amt = convertToAED(t);
        if (t.type === 'expense') monthly[monthIdx].expense += amt;
        else monthly[monthIdx].income += amt;
      });
      trendData = monthly;
    }

    return {
      totalIncomeAED,
      totalExpensesAED,
      balanceAED,
      categoryData,
      trendData
    };
  }, [transactions, filter, exchangeRate]);

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === Currency.AED ? 2 : 0,
      maximumFractionDigits: currency === Currency.AED ? 2 : 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Income</p>
            <h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalIncomeAED, Currency.AED)}</h3>
            <p className="text-sm text-green-600 font-medium">{formatCurrency(stats.totalIncomeAED * exchangeRate, Currency.PKR)}</p>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <TrendingDown className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Expenses</p>
            <h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalExpensesAED, Currency.AED)}</h3>
            <p className="text-sm text-red-600 font-medium">{formatCurrency(stats.totalExpensesAED * exchangeRate, Currency.PKR)}</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Wallet className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Net Savings</p>
            <h3 className="text-xl font-bold text-gray-900">{formatCurrency(stats.balanceAED, Currency.AED)}</h3>
            <p className="text-sm text-blue-600 font-medium">{formatCurrency(stats.balanceAED * exchangeRate, Currency.PKR)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Distribution (in AED)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `AED ${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">
            {filter.mode === 'monthly' ? 'Daily' : 'Monthly'} Cash Flow (AED)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} formatter={(v: number) => v.toFixed(2)} />
                <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} name="Expenses" />
                <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} name="Income" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
