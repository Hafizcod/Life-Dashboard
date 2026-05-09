'use client';

import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { formatCurrency } from '../utils/currency';
import { useAppStore } from '../store/useAppStore';
import { Plus, ChevronDown, ChevronRight, Target, CheckCircle2, PauseCircle, PlayCircle } from 'lucide-react';
import { GoalItem } from '../types/models';

interface GoalsTabProps {
  userId: string;
}

const GoalSection = ({ 
  title, 
  items, 
  icon: Icon, 
  colorClass,
  onAddProgress,
  onEdit
}: { 
  title: string; 
  items: GoalItem[]; 
  icon: any; 
  colorClass: string;
  onAddProgress: (goal: GoalItem) => void;
  onEdit: (goal: GoalItem) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 px-1 text-white/60 hover:text-white transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Icon size={18} className={colorClass} />
          <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
          <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/10 group-hover:bg-white/10 transition-all">
            {items.length}
          </span>
        </div>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {isExpanded && (
        <div className="grid gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {items.map((goal) => {
            const progress = goal.target > 0 ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
            return (
              <div 
                key={goal.id} 
                className="p-5 rounded-4xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                      {goal.icon || '🎯'}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight">{goal.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-emerald-400 font-bold text-sm">{formatCurrency(goal.saved)}</span>
                        <span className="text-white/20 text-xs">/ {formatCurrency(goal.target)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => onAddProgress(goal)}
                      className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/10"
                    >
                      Add Progress
                    </button>
                    <button 
                      onClick={() => onEdit(goal)}
                      className="text-white/20 hover:text-white/60 text-[10px] uppercase font-bold tracking-widest transition-colors"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>

                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-white/30 text-[10px] font-bold uppercase">{goal.status}</span>
                  <span className="text-white/60 text-xs font-bold">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const GoalsTab: React.FC<GoalsTabProps> = ({ userId }) => {
  const { goals, isLoading } = useGoals(userId);
  const { setAddGoalOpen, setAddGoalProgressOpen } = useAppStore();
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(null);

  if (isLoading) return <div className="p-12 text-center text-white/40">Loading goals...</div>;

  const sections = {
    started: (goals.active || []).filter(g => g.status === 'active'),
    paused: (goals.active || []).filter(g => g.status === 'paused'),
    notStarted: goals.notStarted || [],
    done: goals.done || [],
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Financial Goals</h2>
          <p className="text-white/40 text-sm mt-1">Dream big, save small, achieve daily.</p>
        </div>
        <button
          onClick={() => setAddGoalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/40 font-bold"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      <div className="grid gap-2">
        <GoalSection 
          title="In Progress" 
          items={sections.started} 
          icon={PlayCircle} 
          colorClass="text-blue-400"
          onAddProgress={(g) => setAddGoalProgressOpen(true, g)}
          onEdit={(g) => { /* Handle Edit - for now we can reuse AddGoal if needed or just show info */ }}
        />
        <GoalSection 
          title="Paused" 
          items={sections.paused} 
          icon={PauseCircle} 
          colorClass="text-orange-400"
          onAddProgress={(g) => setAddGoalProgressOpen(true, g)}
          onEdit={() => {}}
        />
        <GoalSection 
          title="Not Started" 
          items={sections.notStarted} 
          icon={Target} 
          colorClass="text-rose-400"
          onAddProgress={(g) => setAddGoalProgressOpen(true, g)}
          onEdit={() => {}}
        />
        <GoalSection 
          title="Completed" 
          items={sections.done} 
          icon={CheckCircle2} 
          colorClass="text-emerald-400"
          onAddProgress={(g) => setAddGoalProgressOpen(true, g)}
          onEdit={() => {}}
        />
      </div>
    </div>
  );
};

export default GoalsTab;
