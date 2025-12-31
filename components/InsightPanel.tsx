
import React, { useState, useEffect } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { Transaction, InsightReport } from '../types';
import { BrainCircuit, Lightbulb, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface InsightPanelProps {
  transactions: Transaction[];
  exchangeRate: number;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ transactions, exchangeRate }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<InsightReport | null>(null);

  const fetchInsights = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const data = await getFinancialInsights(transactions, exchangeRate);
    setInsight(data);
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0 && !insight) {
      fetchInsights();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h2 className="text-2xl font-bold">Smart Financial Advisor</h2>
          </div>
          <p className="text-blue-100 max-w-xl mb-6">
            Get personalized insights based on your AED and PKR spending. 
            Gemini analyzes your data using the current exchange rate of 1 AED = {exchangeRate} PKR.
          </p>
          <button 
            onClick={fetchInsights}
            disabled={loading}
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center space-x-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
            <span>{insight ? 'Refresh Insights' : 'Generate Analysis'}</span>
          </button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-64 h-64 -mr-20 -mt-10" />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Gemini is analyzing your spending patterns across currencies...</p>
        </div>
      )}

      {insight && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-full">
            <div className="flex items-center space-x-2 mb-4 text-gray-900">
              <BrainCircuit className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold">Analysis Summary</h3>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{insight.summary}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4 text-gray-900">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold">Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {insight.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-3 text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-4 text-gray-900">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold">Saving Tips</h3>
            </div>
            <ul className="space-y-3">
              {insight.savingTips.map((tip, i) => (
                <li key={i} className="flex items-start space-x-3 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!insight && !loading && (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center text-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <BrainCircuit className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready for analysis?</h3>
          <p className="text-gray-500 max-w-xs">
            Add your transactions and click generate to get AI-powered insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
