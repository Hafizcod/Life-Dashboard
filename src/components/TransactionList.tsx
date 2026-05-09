import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTransactions } from '../hooks/useTransactions';
import TransactionCard from './TransactionCard';
import { Loader2 } from 'lucide-react';

interface TransactionListProps {
  userId: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ userId }) => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useTransactions(userId);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-white/60 font-medium">Loading transactions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
        <p className="text-rose-400">Failed to load transactions. Please check your connection.</p>
      </div>
    );
  }

  const allTransactions = data.pages.flatMap((page) => page.transactions);

  if (allTransactions.length === 0) {
    return (
      <div className="p-12 bg-white/5 border border-white/10 rounded-3xl text-center">
        <p className="text-white/40 italic">No transactions found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
        <span className="text-xs font-semibold px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
          {allTransactions.length} items
        </span>
      </div>

      <div className="grid gap-1">
        {allTransactions.map((transaction) => (
          <TransactionCard key={transaction.$id} transaction={transaction} />
        ))}
      </div>

      {/* Trigger for Infinite Scroll */}
      <div ref={ref} className="py-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-white/40">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        ) : hasNextPage ? (
          <div className="h-4 w-full" /> // Invisible trigger
        ) : (
          <p className="text-white/20 text-xs text-center">You've reached the end of your history</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
