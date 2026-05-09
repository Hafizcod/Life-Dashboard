'use client';

import React from 'react';
import { useAppStore, TabType } from '../../store/useAppStore';
import { 
  Home, 
  PieChart, 
  TrendingUp, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useAppStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { id: 'Home', label: 'Dashboard', icon: Home },
    { id: 'Finance', label: 'Finance', icon: CreditCard },
    { id: 'Investment', label: 'Investments', icon: TrendingUp },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-white dark:bg-[#0f0f0f] border-r border-zinc-200 dark:border-white/5 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-200 dark:border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 shrink-0">
            <PieChart size={24} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="font-bold text-zinc-900 dark:text-white leading-none">Veir Dashboard</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">v2.0 Beta</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={22} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              {!isCollapsed && (
                <span className="font-bold text-sm animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>
              )}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-white/5">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
