'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalSchema, GoalFormValues } from '../utils/schemas';
import { useGoals } from '../hooks/useGoals';
import { useAppStore } from '../store/useAppStore';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { GoalItem } from '../types/models';

const AddGoalModal = ({ userId }: { userId: string }) => {
  const { isAddGoalOpen, setAddGoalOpen } = useAppStore();
  const { goals, updateGoals, isUpdating } = useGoals(userId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      status: 'notStarted',
      saved: 0,
      icon: '🎯',
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    const newGoal: GoalItem = {
      ...data,
      id: uuidv4(),
    };

    const newGoalsData = { ...goals };
    if (data.status === 'done') {
      newGoalsData.done = [...(newGoalsData.done || []), newGoal];
    } else if (data.status === 'notStarted') {
      newGoalsData.notStarted = [...(newGoalsData.notStarted || []), newGoal];
    } else {
      newGoalsData.active = [...(newGoalsData.active || []), newGoal];
    }

    updateGoals(newGoalsData, {
      onSuccess: () => {
        reset();
        setAddGoalOpen(false);
      },
    });
  };

  return (
    <Modal
      isOpen={isAddGoalOpen}
      onClose={() => setAddGoalOpen(false)}
      title="Create New Goal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Goal Name</label>
          <input
            type="text"
            {...register('name')}
            placeholder="e.g. New Macbook Pro"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Target Amount</label>
            <input
              type="text"
              {...register('target')}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            {errors.target && <p className="text-rose-400 text-xs mt-1">{errors.target.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Initial Savings</label>
            <input
              type="text"
              {...register('saved')}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Status</label>
            <select
              {...register('status')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
            >
              <option value="notStarted" className="bg-[#1a1a1a]">Not Started</option>
              <option value="active" className="bg-[#1a1a1a]">Started</option>
              <option value="paused" className="bg-[#1a1a1a]">Paused</option>
              <option value="done" className="bg-[#1a1a1a]">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Icon</label>
            <input
              type="text"
              {...register('icon')}
              placeholder="🎯"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Target Date (Optional)</label>
          <input
            type="date"
            {...register('date')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Goal'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddGoalModal;
