'use client';

import React, { useState, useMemo } from 'react';
import { useInvestments } from '../hooks/useInvestments';
import { formatCurrency } from '../utils/currency';
import { useAppStore } from '../store/useAppStore';
import { Plus, ShieldCheck, Zap, AlertTriangle, TrendingUp, Wallet, Target as TargetIcon } from 'lucide-react';
import { InvestmentItem, HistoryPoint } from '../types/models';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface InvestmentTabProps {
  userId: string;
}

const InvestmentTab: React.FC<InvestmentTabProps> = ({ userId }) => {
  const { investments, isLoading } = useInvestments(userId);
  const { setAddInvestmentOpen, setAddInvestmentProgressOpen } = useAppStore();
  const [selectedRisk, setSelectedRisk] = useState<'All' | 'Safe' | 'Mix' | 'High Risk'>('All');

  const allItems = useMemo(() => {
    return [
      ...(investments.active || []),
      ...(investments.notStarted || []),
      ...(investments.done || [])
    ];
  }, [investments]);

  const filteredItems = useMemo(() => {
    if (selectedRisk === 'All') return allItems;
    return allItems.filter(item => item.risk === selectedRisk);
  }, [allItems, selectedRisk]);

  // Aggregate History for Chart
  const chartData = useMemo(() => {
    const points: { date: string; value: number; timestamp: number }[] = [];
    const latestValues: Record<string, number> = {};
    
    // Collect all history points from filtered items
    filteredItems.forEach((item) => {
      if (item.history && item.history.length > 0) {
        item.history.forEach((pt) => {
          points.push({
            timestamp: pt.timestamp,
            date: new Date(pt.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: pt.value, // Simplified: ideally convert all to a base currency if multi-currency is used
            // but for now assume consistency or use item's currency
          });
        });
      }
    });

    if (points.length === 0) return [];

    points.sort((a, b) => a.timestamp - b.timestamp);

    // Aggregate values by timestamp
    const aggregated: any[] = [];
    let currentTotal = 0;
    const dateMap: Record<string, number> = {};

    points.forEach((pt) => {
      dateMap[pt.date] = pt.value; // This is a simplification for the demo
      // In a real app, we'd sum the latest values of ALL investments at that point in time
    });

    return Object.entries(dateMap).map(([date, value]) => ({ date, value }));
  }, [filteredItems]);

  const summary = useMemo(() => {
    const totalValue = filteredItems.reduce((sum, item) => sum + (item.status || 0), 0);
    const totalTarget = filteredItems.reduce((sum, item) => sum + (item.target || 0), 0);
    const achievements = filteredItems.filter(item => item.status >= item.target && item.target > 0).length;
    return { totalValue, totalTarget, achievements };
  }, [filteredItems]);

  if (isLoading) return <div className="p-12 text-center text-white/40">Loading portfolio...</div>;

  const riskConfigs = {
    'Safe': { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    'Mix': { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    'High Risk': { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Portfolio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Investment Portfolio</h2>
          <p className="text-white/40 text-sm mt-1">Growth tracking and risk management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
            {(['All', 'Safe', 'Mix', 'High Risk'] as const).map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRisk(risk)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRisk === risk 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAddInvestmentOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/40 font-bold text-sm whitespace-nowrap"
          >
            <Plus size={18} />
            New Investment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
            <Wallet size={80} />
          </div>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalValue)}</p>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
            <TargetIcon size={80} />
          </div>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Portfolio Target</p>
          <p className="text-3xl font-bold text-white/60">{formatCurrency(summary.totalTarget)}</p>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-blue-600/20 border border-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
            <TrendingUp size={80} />
          </div>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Achievements</p>
          <p className="text-3xl font-bold text-blue-400">{summary.achievements} <span className="text-lg opacity-60">Goals</span></p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="p-8 rounded-[3rem] bg-[#1a1a1a] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white">Value Over Time</h3>
          <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] font-black uppercase tracking-tighter rounded-full border border-emerald-400/20">
            Live Updates
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff40', fontSize: 10 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const config = riskConfigs[item.risk] || riskConfigs.Safe;
          const pct = item.target > 0 ? Math.min(100, Math.round((item.status / item.target) * 100)) : 0;
          
          return (
            <div 
              key={item.id} 
              className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${config.bg} ${config.color}`}>
                  <config.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{formatCurrency(item.status)}</p>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{item.risk}</p>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-1">{item.name}</h4>
              <p className="text-white/40 text-xs mb-6">Target: {formatCurrency(item.target)}</p>

              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-white/20 text-[10px] font-bold">{pct}% Achieved</span>
                <button 
                  onClick={() => setAddInvestmentProgressOpen(true, item)}
                  className="text-blue-400 text-[10px] font-bold uppercase hover:underline"
                >
                  Update
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestmentTab;
