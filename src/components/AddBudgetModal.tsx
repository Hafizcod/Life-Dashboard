'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, BudgetFormValues } from '../utils/schemas';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { useAppStore } from '../store/useAppStore';
import { BudgetItem } from '../types/models';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';

const AddBudgetModal = ({ userId }: { userId: string }) => {
  const { isAddBudgetOpen, setAddBudgetOpen } = useAppStore();
  const { budget, updateBudget, isUpdating } = useBudgets(userId);
  const { addCategory } = useCategories(userId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: '',
      monthly: 0,
      color: '#3b82f6',
      emoji: '💵',
    },
  });

  const onSubmit = (data: BudgetFormValues) => {
    // 1. Prepare new budget items
    const newItems: BudgetItem[] = [...(budget?.items || [])];
    
    // Check if category already exists in budget
    const existingIndex = newItems.findIndex(item => item.category === data.category);
    
    // After validation, data.monthly is guaranteed to be a number by Zod
    const monthlyValue = Number(data.monthly);

    if (existingIndex !== -1) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        monthly: monthlyValue,
      };
    } else {
      newItems.push({
        category: data.category,
        subCategory: '',
        monthly: monthlyValue,
      });
    }

    // 2. Update budget doc
    updateBudget({ ...budget, items: newItems }, {
      onSuccess: () => {
        // 3. Ensure category exists in master categories
        addCategory({
          name: data.category,
          type: 'expense',
          emoji: data.emoji || '💵',
          color: data.color || '#3b82f6',
          userId
        });
        
        reset();
        setAddBudgetOpen(false);
      }
    });
  };

  return (
    <Modal
      isOpen={isAddBudgetOpen}
      onClose={() => setAddBudgetOpen(false)}
      title="Add Expense Budget"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Category Name</label>
          <input
            type="text"
            {...register('category')}
            placeholder="e.g. Food & Drinks"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {errors.category && <p className="text-rose-400 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Monthly Limit</label>
            <input
              type="text"
              {...register('monthly')}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            {errors.monthly && <p className="text-rose-400 text-xs mt-1">{errors.monthly.message?.toString()}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Emoji</label>
            <input
              type="text"
              {...register('emoji')}
              placeholder="💵"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Theme Color</label>
          <input
            type="color"
            {...register('color')}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
              Saving...
            </>
          ) : (
            'Save Budget'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
