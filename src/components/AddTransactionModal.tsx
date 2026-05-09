'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormValues } from '../utils/schemas';
import { useAddTransaction } from '../hooks/useTransactions';
import { useAppStore } from '../store/useAppStore';
import Modal from './ui/Modal';
import { Loader2 } from 'lucide-react';

const AddTransactionModal = ({ userId }: { userId: string }) => {
  const { isAddTransactionOpen, setAddTransactionOpen } = useAppStore();
  const { mutate: addTransaction, isPending: isAdding } = useAddTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      userId: userId,
      amount: 0
    },
  });

  const typeValue = watch('type');

  const onSubmit = (data: TransactionFormValues) => {
    addTransaction({
      ...data,
      amount: Number(data.amount),
      note: String(data.note || '')
    }, {
      onSuccess: () => {
        reset();
        setAddTransactionOpen(false);
      },
    });
  };

  return (
    <Modal
      isOpen={isAddTransactionOpen}
      onClose={() => setAddTransactionOpen(false)}
      title="Add New Transaction"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {(['expense', 'income'] as const).map((type) => (
            <label
              key={type}
              className={`flex-1 text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                typeValue === type 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <input 
                type="radio" 
                value={type} 
                {...register('type')} 
                className="hidden" 
              />
              {type}
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Amount</label>
          <input
            type="text"
            {...register('amount')}
            placeholder="0"
            autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xl font-bold"
          />
          {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount.message?.toString()}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
            <input
              type="text"
              {...register('category')}
              placeholder="e.g. Food"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Date</label>
            <input
              type="date"
              {...register('date')}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Note (Optional)</label>
          <textarea
            {...register('note')}
            placeholder="What was this for?"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none h-24"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Transaction'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
