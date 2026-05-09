import { z } from 'zod';

// Helper to coerce any input into a number, handling currency strings
// We use a preprocessor to normalize the value before validation
const currencyToNumber = (val: any) => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const transactionSchema = z.object({
  amount: z.preprocess(currencyToNumber, z.number().positive('Amount must be positive')),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().default(''), 
  userId: z.string().min(1, 'User ID is required'),
});

// We define form values to match the expected INPUT of the form (can be string or number)
// while letting Zod handle the conversion to the final model type
export type TransactionFormValues = {
  amount: any;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
  userId: string;
};

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['income', 'expense']),
  emoji: z.string().emoji('Please enter a valid emoji'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  monthly: z.preprocess(currencyToNumber, z.number().positive('Amount must be positive')),
  subCategories: z.array(z.string()).optional(),
  color: z.string().optional(),
  emoji: z.string().optional(),
});

export type BudgetFormValues = {
  category: string;
  monthly: any;
  subCategories?: string[];
  color?: string;
  emoji?: string;
};

export const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  target: z.preprocess(currencyToNumber, z.number().positive('Target must be positive')),
  saved: z.preprocess(currencyToNumber, z.number().min(0).default(0)),
  status: z.enum(['active', 'paused', 'notStarted', 'done']),
  date: z.string().optional(),
  icon: z.string().optional().default('🎯'),
});

export type GoalFormValues = {
  name: string;
  target: any;
  saved: any;
  status: 'active' | 'paused' | 'notStarted' | 'done';
  date?: string;
  icon: string;
};

export const goalProgressSchema = z.object({
  amount: z.preprocess(currencyToNumber, z.number().positive('Amount must be positive')),
});

export type GoalProgressFormValues = {
  amount: any;
};

export const investmentSchema = z.object({
  name: z.string().min(1, 'Investment name is required'),
  target: z.preprocess(currencyToNumber, z.number().positive('Target must be positive')),
  status: z.preprocess(currencyToNumber, z.number().min(0).default(0)),
  risk: z.enum(['Safe', 'Mix', 'High Risk']),
  date: z.string().optional(),
  icon: z.string().optional().default('💰'),
});

export type InvestmentFormValues = {
  name: string;
  target: any;
  status: any;
  risk: 'Safe' | 'Mix' | 'High Risk';
  date?: string;
  icon: string;
};

export const investmentProgressSchema = z.object({
  amount: z.preprocess(currencyToNumber, z.number().positive('Amount must be positive')),
  mode: z.enum(['add', 'update']),
});

export type InvestmentProgressFormValues = {
  amount: any;
  mode: 'add' | 'update';
};
