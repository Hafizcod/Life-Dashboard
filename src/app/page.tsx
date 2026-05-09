'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileNav from '../components/layout/MobileNav';
import HomeView from '../components/HomeView';
import FinanceView from '../components/FinanceView';
import InvestmentTab from '../components/InvestmentTab';
import Modals from '../components/Modals';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, checkAuth, isLoading: authLoading } = useAuthStore();
  const { activeTab } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white animate-bounce shadow-2xl shadow-blue-600/20">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="mt-6 text-zinc-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Security...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-zinc-500 max-w-md mb-8">Please log in to your Appwrite account to access your personal dashboard.</p>
        <button 
          onClick={() => window.location.href = '/login'} // Assume a login page exists or handle via modal
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex overflow-x-hidden">
      {/* Navigation Layout */}
      <Sidebar />
      <MobileNav />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 transition-all duration-300 min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-[1600px] w-full mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'Home' && <HomeView userId={user.$id} />}
            {activeTab === 'Finance' && <FinanceView userId={user.$id} />}
            {activeTab === 'Investment' && <InvestmentTab userId={user.$id} />}
            {activeTab === 'Settings' && (
              <div className="p-12 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-white/5 rounded-[3rem]">
                <p>Settings module migration in progress...</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Modals */}
        <Modals userId={user.$id} />
      </main>
    </div>
  );
}
