export interface Transaction {
  $id: string;
  amount: number;
  category: string;
  note: string;
  type: 'income' | 'expense';
  date: string;
  userId: string;
}

export interface Goal {
  $id: string;
  name: string;
  target: number;
  saved: number;
  status: 'active' | 'notStarted' | 'done';
  isInvestment?: boolean;
}
