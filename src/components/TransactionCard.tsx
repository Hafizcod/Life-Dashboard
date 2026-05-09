import React from 'react';
import { Transaction } from '../types/models';
import { formatCurrency } from '../utils/currency';
import { formatDate } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
  categoryEmoji?: string;
  categoryColor?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  categoryEmoji = '💰',
  categoryColor = '#10B981',
}) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 mb-3 group">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${categoryColor}20`, border: `1px solid ${categoryColor}40` }}
        >
          {categoryEmoji}
        </div>
        <div>
          <h4 className="text-white font-medium text-lg leading-tight">
            {transaction.category}
          </h4>
          <p className="text-white/40 text-sm mt-1">
            {transaction.note || 'No note'}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <div className={`text-lg font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency || 'IDR')}
        </div>
        <p className="text-white/30 text-xs mt-1">
          {formatDate(new Date(transaction.date), 'dd MMM yyyy')}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
