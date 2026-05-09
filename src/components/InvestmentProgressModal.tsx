'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentProgressSchema, InvestmentProgressFormValues } from '../utils/schemas';
import { useInvestments } from '../hooks/useInvestments';
import { useAppStore } from '../store/useAppStore';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';
import { InvestmentItem } from '../types/models';

const InvestmentProgressModal = ({ userId }: { userId: string }) => {
  const { isAddInvestmentProgressOpen, setAddInvestmentProgressOpen, selectedInvestment } = useAppStore();
  const { investments, updateInvestments, isUpdating } = useInvestments(userId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<InvestmentProgressFormValues>({
    resolver: zodResolver(investmentProgressSchema),
    defaultValues: {
      mode: 'add'
    }
  });

  const mode = watch('mode');

  const onSubmit = (data: InvestmentProgressFormValues) => {
    if (!selectedInvestment) return;

    const newInvestmentsData = { ...investments };
    const section = selectedInvestment.target > 0 && selectedInvestment.status >= selectedInvestment.target ? 'done' : 'active';
    
    // For simplicity, we search in all sections
    let foundSection: 'active' | 'notStarted' | 'done' | null = null;
    let index = -1;

    (['active', 'notStarted', 'done'] as const).forEach(s => {
      const idx = (newInvestmentsData[s] || []).findIndex(inv => inv.id === selectedInvestment.id);
      if (idx !== -1) {
        foundSection = s;
        index = idx;
      }
    });

    if (foundSection && index !== -1) {
      const list = [...(newInvestmentsData[foundSection] || [])];
      const updatedInv = { ...list[index] };
      
      const prevValue = updatedInv.status || 0;
      const newValue = data.mode === 'add' ? prevValue + data.amount : data.amount;
      
      updatedInv.status = newValue;
      if (!updatedInv.history) updatedInv.history = [];
      updatedInv.history.push({ timestamp: Date.now(), value: newValue });

      // Check if finished
      if (updatedInv.target > 0 && updatedInv.status >= updatedInv.target && foundSection !== 'done') {
        list.splice(index, 1);
        newInvestmentsData[foundSection] = list;
        newInvestmentsData.done = [...(newInvestmentsData.done || []), updatedInv];
      } else {
        list[index] = updatedInv;
        newInvestmentsData[foundSection] = list;
      }

      updateInvestments(newInvestmentsData, {
        onSuccess: () => {
          reset();
          setAddInvestmentProgressOpen(false);
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isAddInvestmentProgressOpen}
      onClose={() => setAddInvestmentProgressOpen(false)}
      title={`Update: ${selectedInvestment?.name || ''}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => setValue('mode', 'add')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'add' ? 'bg-blue-600 text-white' : 'text-white/40'
            }`}
          >
            Add Amount
          </button>
          <button
            type="button"
            onClick={() => setValue('mode', 'update')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'update' ? 'bg-blue-600 text-white' : 'text-white/40'
            }`}
          >
            Set Total
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            {mode === 'add' ? 'Amount to Add' : 'New Total Balance'}
          </label>
          <input
            type="text"
            {...register('amount')}
            placeholder="0"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xl font-bold"
          />
          {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount.message}</p>}
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
            'Confirm Changes'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default InvestmentProgressModal;
