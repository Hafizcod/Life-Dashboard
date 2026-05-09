'use client';

import React, { useState } from 'react';
import TransactionList from './TransactionList';
import BudgetTab from './BudgetTab';
import GoalsTab from './GoalsTab';

interface FinanceViewProps {
  userId: string;
}

const FinanceView: React.FC<FinanceViewProps> = ({ userId }) => {
  const [activeSubTab, setActiveSubTab] = useState<'Transactions' | 'Budgets' | 'Goals'>('Transactions');

  const tabs = [
    { id: 'Transactions', label: 'History' },
    { id: 'Budgets', label: 'Budgets' },
    { id: 'Goals', label: 'Goals' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl w-full md:w-max border border-zinc-200 dark:border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tab.id 
                ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeSubTab === 'Transactions' && <TransactionList userId={userId} />}
        {activeSubTab === 'Budgets' && <BudgetTab userId={userId} />}
        {activeSubTab === 'Goals' && <GoalsTab userId={userId} />}
      </div>
    </div>
  );
};

export default FinanceView;
