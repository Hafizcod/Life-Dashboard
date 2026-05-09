'use client';

import React, { useMemo } from 'react';
import DashboardSummary from './DashboardSummary';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from './TransactionCard';
import { ArrowUpRight, Plus, ShieldCheck, Target } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Transaction } from '../types/models';

interface HomeViewProps {
  userId: string;
}

const HomeView: React.FC<HomeViewProps> = ({ userId }) => {
  const { data, isLoading } = useTransactions(userId);
  const { setAddTransactionOpen, setActiveTab } = useAppStore();

  const recentTransactions = useMemo(() => {
    return data?.pages[0]?.transactions.slice(0, 5) || [];
  }, [data]);

  const stats = useMemo(() => {
    // This is a simplification. In a real app, you'd fetch these from a summary service.
    // Here we compute from the first page of transactions as a placeholder.
    let income = 0;
    let expense = 0;
    
    data?.pages[0]?.transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [data]);

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <DashboardSummary 
        totalBalance={stats.balance}
        monthlyIncome={stats.income}
        monthlyExpense={stats.expense}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Transactions</h3>
            <button 
              onClick={() => setActiveTab('Finance')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              See all <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="space-y-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-20 w-full bg-zinc-100 dark:bg-white/5 animate-pulse rounded-3xl" />
              ))
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((tx: Transaction) => (
                <TransactionCard key={tx.$id} transaction={tx} />
              ))
            ) : (
              <div className="p-12 text-center bg-zinc-50 dark:bg-white/2 rounded-4xl border border-dashed border-zinc-200 dark:border-white/10">
                <p className="text-zinc-400 text-sm">No transactions yet. Start tracking today!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Insight */}
        <div className="space-y-6">
          <div className="p-8 rounded-4xl bg-blue-600 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xl font-bold mb-2">Manage Wealth</h3>
            <p className="text-blue-100 text-xs mb-8 leading-relaxed opacity-80">Track your investments and goals in one place with automated insights.</p>
            <button 
              onClick={() => setAddTransactionOpen(true)}
              className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveTab('Finance')}
              className="p-6 rounded-4xl bg-zinc-100 dark:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all flex flex-col items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform">
                <Target size={20} className="text-rose-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Goals</span>
            </button>
            <button 
              onClick={() => setActiveTab('Investment')}
              className="p-6 rounded-4xl bg-zinc-100 dark:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all flex flex-col items-center gap-3 group"
            >
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Assets</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
