
import React from 'react';
import { LayoutDashboard, Receipt, BrainCircuit, Wallet } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { id: 'insights', label: 'AI Insights', icon: <BrainCircuit className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 lg:h-screen sticky top-0 flex flex-col z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-blue-600 mb-8">
          <Wallet className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">SpendWise AI</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100 hidden lg:block">
        <div className="bg-blue-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium opacity-80 mb-1">PREMIUM ACCESS</p>
          <p className="text-sm font-bold mb-3">AI Budget Planning</p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg transition-colors font-semibold">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
