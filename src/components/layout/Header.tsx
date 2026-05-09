'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthStore();
  const { activeTab } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'Home': return 'Main Dashboard';
      case 'Finance': return 'Financial Control';
      case 'Investment': return 'Asset Portfolio';
      case 'Settings': return 'Preferences';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 transition-all duration-300">
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight leading-none">
          {getPageTitle()}
        </h1>
        <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden md:flex items-center bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-2xl border border-transparent focus-within:border-blue-500/50 transition-all group">
          <Search size={18} className="text-zinc-400 group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 text-zinc-900 dark:text-white placeholder:text-zinc-400 w-48"
          />
        </div>

        <button className="p-2.5 md:p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all border border-transparent hover:border-zinc-200 dark:hover:border-white/10 relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#0a0a0a]" />
        </button>

        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 md:p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className="h-8 w-px bg-zinc-200 dark:bg-white/10 mx-1 hidden md:block" />

        <div className="flex items-center gap-3 pl-1">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-zinc-900 dark:text-white leading-none">
              {user?.name || 'User'}
            </span>
            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter mt-1">Premium Tier</span>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-blue-600/20">
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
              {user?.prefs?.avatar ? (
                <img src={user.prefs.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={22} className="text-zinc-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
