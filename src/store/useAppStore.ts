import { create } from 'zustand';

export type TabType = 'Home' | 'Finance' | 'Investment' | 'Settings';

interface AppState {
  user: any | null;
  setUser: (user: any | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Modal States
  isAddTransactionOpen: boolean;
  isAddBudgetOpen: boolean;
  isAddGoalOpen: boolean;
  isAddGoalProgressOpen: boolean;
  isAddInvestmentOpen: boolean;
  isAddInvestmentProgressOpen: boolean;
  selectedGoal: any | null;
  selectedInvestment: any | null;
  
  // Modal Setters
  setAddTransactionOpen: (open: boolean) => void;
  setAddBudgetOpen: (open: boolean) => void;
  setAddGoalOpen: (open: boolean) => void;
  setAddGoalProgressOpen: (open: boolean, goal?: any) => void;
  setAddInvestmentOpen: (open: boolean) => void;
  setAddInvestmentProgressOpen: (open: boolean, investment?: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  activeTab: 'Home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Modal initial states
  isAddTransactionOpen: false,
  isAddBudgetOpen: false,
  isAddGoalOpen: false,
  isAddGoalProgressOpen: false,
  isAddInvestmentOpen: false,
  isAddInvestmentProgressOpen: false,
  selectedGoal: null,
  selectedInvestment: null,

  // Modal setters
  setAddTransactionOpen: (open) => set({ isAddTransactionOpen: open }),
  setAddBudgetOpen: (open) => set({ isAddBudgetOpen: open }),
  setAddGoalOpen: (open) => set({ isAddGoalOpen: open }),
  setAddGoalProgressOpen: (open, goal = null) => set({ isAddGoalProgressOpen: open, selectedGoal: goal }),
  setAddInvestmentOpen: (open) => set({ isAddInvestmentOpen: open }),
  setAddInvestmentProgressOpen: (open, investment = null) => set({ isAddInvestmentProgressOpen: open, selectedInvestment: investment }),
}));
