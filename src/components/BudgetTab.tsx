'use client';

import React from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/currency';
import { useAppStore } from '../store/useAppStore';
import { Plus, Info } from 'lucide-react';

interface BudgetTabProps {
  userId: string;
}

const BudgetTab: React.FC<BudgetTabProps> = ({ userId }) => {
  const { budget, isLoading: isBudgetLoading } = useBudgets(userId);
  const { data: categories, isLoading: isCatsLoading } = useCategories(userId);
  const { data: txnsData } = useTransactions(userId);
  const { setAddBudgetOpen } = useAppStore();

  const transactions = txnsData?.pages.flatMap(p => p.transactions) || [];
  
  // Calculate Summary
  const incomeCats = categories?.filter(c => c.type === 'income') || [];
  const totalIncome = incomeCats.reduce((sum, c) => sum + (c.monthly || 0), 0);
  
  const budgetItems = budget.items || [];
  const totalAlloc = budgetItems.reduce((sum, b) => sum + (b.monthly || 0), 0);
  const remaining = totalIncome - totalAlloc;

  // Calculate Spent per Category (Current Month)
  const currentMonth = new Date().toISOString().substring(0, 7);
  const expensesThisMonth = transactions.reduce((acc: Record<string, number>, t) => {
    if (t.type === 'expense' && t.date.startsWith(currentMonth)) {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  // Group budget items by category
  const groupedBudgets = budgetItems.reduce((acc: Record<string, any>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { category: item.category, allocated: 0, subs: [] };
    }
    acc[item.category].allocated += item.monthly;
    if (item.subCategory) acc[item.category].subs.push(item.subCategory);
    return acc;
  }, {});

  const budgetRows = Object.values(groupedBudgets);

  if (isBudgetLoading || isCatsLoading) {
    return <div className="p-12 text-center text-white/40">Loading budget...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Monthly Income</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="p-6 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Total Allocation</p>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(totalAlloc)}</p>
        </div>
        <div className="p-6 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Remaining Buffer</p>
          <p className={`text-2xl font-bold ${remaining < 0 ? 'text-rose-400' : 'text-white'}`}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Expense Budgets</h2>
          <p className="text-white/40 text-sm mt-1">Track your monthly spending limits</p>
        </div>
        <button
          onClick={() => setAddBudgetOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/20 font-semibold text-sm"
        >
          <Plus size={18} />
          Add Budget
        </button>
      </div>

      {/* Budget List */}
      <div className="grid gap-4">
        {budgetRows.length === 0 ? (
          <div className="p-12 text-center bg-white/5 rounded-4xl border border-dashed border-white/10">
            <p className="text-white/30 italic">No budgets set up yet.</p>
          </div>
        ) : (
          budgetRows.map((row: any) => {
            const catObj = categories?.find(c => c.name === row.category);
            const spent = expensesThisMonth[row.category] || 0;
            const pct = row.allocated > 0 ? (spent / row.allocated) * 100 : 0;
            const displayPct = Math.min(pct, 100);
            const isOver = spent > row.allocated;

            return (
              <div key={row.category} className="p-6 rounded-4xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                      style={{ backgroundColor: `${catObj?.color || '#3b82f6'}20`, color: catObj?.color || '#3b82f6' }}
                    >
                      {catObj?.emoji || '💵'}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight">{row.category}</h4>
                      <p className="text-white/30 text-xs mt-1 truncate max-w-[200px]">
                        {row.subs.join(', ') || 'Global Category'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{formatCurrency(row.allocated)}</div>
                    <div className={`text-xs font-medium mt-1 ${isOver ? 'text-rose-400' : 'text-white/40'}`}>
                      {isOver ? `Over by ${formatCurrency(spent - row.allocated)}` : `Remaining ${formatCurrency(row.allocated - spent)}`}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${isOver ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'bg-blue-500'}`}
                    style={{ 
                      width: `${displayPct}%`,
                      backgroundColor: !isOver ? catObj?.color : undefined 
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetTab;
