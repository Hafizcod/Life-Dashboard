import { useMutation, useQueryClient, useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { transactionService } from '../services/transactionService';
import { Transaction } from '../types/models';

export const useTransactions = (userId: string) => {
  return useInfiniteQuery<
    { transactions: Transaction[]; total: number; nextCursor: string | null },
    Error,
    InfiniteData<{ transactions: Transaction[]; total: number; nextCursor: string | null }, string | undefined>,
    (string | string[])[],
    string | undefined
  >({
    queryKey: ['transactions', userId],
    queryFn: ({ pageParam }) => transactionService.getTransactions(userId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTxn: Omit<Transaction, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$databaseId' | '$collectionId'>) =>
      transactionService.addTransaction(newTxn),
    
    // --- OPTIMISTIC UPDATE ---
    onMutate: async (newTxn) => {
      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData(['transactions']);

      // Optimistically update to the new value
      queryClient.setQueryData(['transactions'], (old: any) => {
        const optimisticTxn = {
          ...newTxn,
          $id: 'temp-' + Date.now(), // temporary ID
          $createdAt: new Date().toISOString(),
        };
        
        // This logic depends on how your cache is structured (pagination vs list)
        // For simplicity, let's assume we update the first page or a general list
        if (old && old.transactions) {
          return {
            ...old,
            transactions: [optimisticTxn, ...old.transactions],
          };
        }
        return old;
      });

      // Return context with the snapshotted value
      return { previousTransactions };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTxn, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions);
      }
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
