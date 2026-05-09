'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormValues } from '../utils/schemas';
import { useAddTransaction } from '../hooks/useTransactions';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { Loader2 } from 'lucide-react';

const AddTransactionForm = () => {
  const { user } = useAuthStore();
  const { setAddTransactionOpen } = useAppStore();
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      userId: user?.$id || '',
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    addTransaction(data, {
      onSuccess: () => {
        reset();
        setAddTransactionOpen(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-white/60 mb-2">Amount</label>
          <input
            type="text"
            {...register('amount')}
            placeholder="0"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {errors.amount && <p className="text-rose-400 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
          <select
            {...register('type')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
          >
            <option value="expense" className="bg-[#1a1a1a]">Expense</option>
            <option value="income" className="bg-[#1a1a1a]">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Date</label>
          <input
            type="date"
            {...register('date')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
          <input
            type="text"
            {...register('category')}
            placeholder="e.g. Food, Salary, Rent"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          {errors.category && <p className="text-rose-400 text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-white/60 mb-2">Note (Optional)</label>
          <textarea
            {...register('note')}
            rows={3}
            placeholder="Add a description..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          'Add Transaction'
        )}
      </button>
    </form>
  );
};

export default AddTransactionForm;
