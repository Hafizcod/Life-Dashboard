'use client';

import React from 'react';
import AddTransactionModal from './AddTransactionModal';
import AddBudgetModal from './AddBudgetModal';
import AddGoalModal from './AddGoalModal';
import AddGoalProgressModal from './AddGoalProgressModal';
import AddInvestmentModal from './AddInvestmentModal';
import InvestmentProgressModal from './InvestmentProgressModal';

interface ModalsProps {
  userId: string;
}

const Modals: React.FC<ModalsProps> = ({ userId }) => {
  return (
    <>
      <AddTransactionModal userId={userId} />
      <AddBudgetModal userId={userId} />
      <AddGoalModal userId={userId} />
      <AddGoalProgressModal userId={userId} />
      <AddInvestmentModal userId={userId} />
      <InvestmentProgressModal userId={userId} />
    </>
  );
};

export default Modals;
