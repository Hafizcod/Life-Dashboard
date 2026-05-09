'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalProgressSchema, GoalProgressFormValues } from '../utils/schemas';
import { useGoals } from '../hooks/useGoals';
import { useAppStore } from '../store/useAppStore';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';
import { GoalItem } from '../types/models';

const AddGoalProgressModal = ({ userId }: { userId: string }) => {
  const { isAddGoalProgressOpen, setAddGoalProgressOpen, selectedGoal } = useAppStore();
  const { goals, updateGoals, isUpdating } = useGoals(userId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalProgressFormValues>({
    resolver: zodResolver(goalProgressSchema),
  });

  const onSubmit = (data: GoalProgressFormValues) => {
    if (!selectedGoal) return;

    const newGoalsData = { ...goals };
    const section = selectedGoal.status === 'done' ? 'done' : 
                   selectedGoal.status === 'notStarted' ? 'notStarted' : 'active';
    
    const list = [...((newGoalsData[section as keyof typeof newGoalsData] as GoalItem[]) || [])];
    const index = list.findIndex(g => g.id === selectedGoal.id);

    if (index !== -1) {
      const updatedGoal = { ...list[index] };
      const amountToAdd = Number(data.amount);
      updatedGoal.saved = (updatedGoal.saved || 0) + amountToAdd;
      
      // Auto-mark as done if target reached
      if (updatedGoal.saved >= updatedGoal.target) {
        updatedGoal.status = 'done';
        list.splice(index, 1);
        (newGoalsData[section as keyof typeof newGoalsData] as GoalItem[]) = list;
        newGoalsData.done = [...(newGoalsData.done || []), updatedGoal];
      } else {
        list[index] = updatedGoal;
        (newGoalsData[section as keyof typeof newGoalsData] as GoalItem[]) = list;
      }

      updateGoals(newGoalsData, {
        onSuccess: () => {
          reset();
          setAddGoalProgressOpen(false);
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isAddGoalProgressOpen}
      onClose={() => setAddGoalProgressOpen(false)}
      title={`Add Progress: ${selectedGoal?.name || ''}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Amount to Add</label>
          <input
            type="text"
            {...register('amount')}
            placeholder="0"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xl font-bold"
          />
          {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount.message?.toString()}</p>}
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            'Confirm Progress'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddGoalProgressModal;
