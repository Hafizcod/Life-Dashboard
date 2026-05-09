'use client';

import React from 'react';
import { useAppStore, TabType } from '../../store/useAppStore';
import { Home, CreditCard, TrendingUp, Plus, User } from 'lucide-react';

const MobileNav = () => {
  const { activeTab, setActiveTab, setAddTransactionOpen } = useAppStore();

  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Finance', label: 'Finance', icon: CreditCard },
    { id: 'spacer', label: '', icon: null }, // Center spacer for plus button
    { id: 'Investment', label: 'Invest', icon: TrendingUp },
    { id: 'Settings', label: 'User', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-8 left-6 right-6 z-100 flex flex-col items-center pointer-events-none">
      {/* Floating Plus Button */}
      <button
        onClick={() => setAddTransactionOpen(true)}
        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgb(37,99,235,0.4)] pointer-events-auto active:scale-90 transition-transform mb-[-32px] z-110 border-4 border-white dark:border-[#0a0a0a]"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* Bottom Nav Bar */}
      <div className="w-full h-16 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-2xl rounded-4xl border border-zinc-200 dark:border-white/10 flex items-center justify-between px-4 pointer-events-auto shadow-2xl">
        {navItems.map((item, idx) => {
          if (item.id === 'spacer') {
            return <div key={idx} className="w-16" />;
          }

          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {item.icon && <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />}
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-current mt-[-2px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
