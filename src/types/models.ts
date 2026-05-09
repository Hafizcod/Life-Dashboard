export interface AppwriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

export interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  registration: string;
  status: boolean;
  labels: string[];
  prefs: Record<string, any>;
}

export interface Transaction extends AppwriteDocument {
  amount: number;
  category: string;
  note: string;
  type: 'income' | 'expense';
  date: string;
  userId: string;
  currency?: string;
}

export interface Category extends AppwriteDocument {
  name: string;
  type: 'income' | 'expense';
  emoji: string;
  color: string;
  userId: string;
}

export interface GoalItem {
  id: string;
  name: string;
  target: number;
  saved: number;
  status: 'active' | 'notStarted' | 'done' | 'paused';
  currency?: string;
  date?: string;
  icon?: string;
}

export interface Goal extends AppwriteDocument {
  data: string; // JSON string in old project
  userId: string;
}

// Interface for parsed Goal data
export interface ParsedGoal {
  active: GoalItem[];
  notStarted: GoalItem[];
  done: GoalItem[];
  paused?: GoalItem[];
}

export interface BudgetItem {
  category: string;
  subCategory?: string;
  monthly: number;
  currency?: string;
}

export interface Budget extends AppwriteDocument {
  data: string; // JSON string in old project
  userId: string;
}

export interface ParsedBudget {
  items: BudgetItem[];
  goals: any[];
  income: {
    monthly: number;
    daily: number;
  };
}

export interface HistoryPoint {
  timestamp: number;
  value: number;
}

export interface InvestmentItem extends Omit<GoalItem, 'status'> {
  risk: 'Safe' | 'Mix' | 'High Risk';
  status: number; // For investments, status is the current value (numeric)
  history: HistoryPoint[];
}

export interface Investment extends AppwriteDocument {
  data: string; // JSON string in old project
  userId: string;
}

export interface ParsedInvestment {
  active: InvestmentItem[];
  notStarted: InvestmentItem[];
  done: InvestmentItem[];
  [key: string]: InvestmentItem[] | undefined;
}
