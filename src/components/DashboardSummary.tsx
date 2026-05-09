import React from 'react';
import { formatCurrency } from '../utils/currency';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardSummaryProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  currencyCode?: string;
}

const SummaryCard = ({ 
  label, 
  value, 
  icon: Icon, 
  variant = 'neutral' 
}: { 
  label: string; 
  value: number; 
  icon: any; 
  variant?: 'income' | 'expense' | 'neutral';
  currencyCode?: string;
}) => {
  const colors = {
    income: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    expense: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    neutral: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  };

  return (
    <div className={`p-6 rounded-4xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${colors[variant]}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl bg-current bg-opacity-10`}>
          <Icon size={20} />
        </div>
        <span className="text-white/60 font-medium tracking-wide uppercase text-xs">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">
        {formatCurrency(value)}
      </div>
      <div className="text-white/30 text-xs mt-2 font-medium">This Month</div>
    </div>
  );
};

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard 
        label="Total Balance" 
        value={totalBalance} 
        icon={Wallet} 
        variant="neutral" 
      />
      <SummaryCard 
        label="Total Income" 
        value={monthlyIncome} 
        icon={TrendingUp} 
        variant="income" 
      />
      <SummaryCard 
        label="Total Expense" 
        value={monthlyExpense} 
        icon={TrendingDown} 
        variant="expense" 
      />
    </div>
  );
};

export default DashboardSummary;
