'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentSchema, InvestmentFormValues } from '../utils/schemas';
import { useInvestments } from '../hooks/useInvestments';
import { useAppStore } from '../store/useAppStore';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { InvestmentItem } from '../types/models';

const AddInvestmentModal = ({ userId }: { userId: string }) => {
  const { isAddInvestmentOpen, setAddInvestmentOpen } = useAppStore();
  const { investments, updateInvestments, isUpdating } = useInvestments(userId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      status: 0,
      risk: 'Safe',
      icon: '💰',
    },
  });

  const onSubmit = (data: InvestmentFormValues) => {
    const now = Date.now();
    const newInvestment: InvestmentItem = {
      ...data,
      id: uuidv4(),
      history: [
        { timestamp: now - 1000, value: 0 },
        { timestamp: now, value: data.status || 0 }
      ]
    };

    const newInvestmentsData = { ...investments };
    newInvestmentsData.active = [...(newInvestmentsData.active || []), newInvestment];

    updateInvestments(newInvestmentsData, {
      onSuccess: () => {
        reset();
        setAddInvestmentOpen(false);
      },
    });
  };

  return (
    <Modal
      isOpen={isAddInvestmentOpen}
      onClose={() => setAddInvestmentOpen(false)}
      title="Add Investment Goal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Investment Name</label>
          <input
            type="text"
            {...register('name')}
            placeholder="e.g. Emas Logam Mulia"
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
            <label className="block text-sm font-medium text-white/60 mb-2">Initial Balance</label>
            <input
              type="text"
              {...register('status')}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Risk Level</label>
            <select
              {...register('risk')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
            >
              <option value="Safe" className="bg-[#1a1a1a]">Safe</option>
              <option value="Mix" className="bg-[#1a1a1a]">Mix</option>
              <option value="High Risk" className="bg-[#1a1a1a]">High Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Icon</label>
            <input
              type="text"
              {...register('icon')}
              placeholder="💰"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
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
            'Create Investment'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddInvestmentModal;
