import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budgetService';
import { ParsedBudget, Budget } from '../types/models';

export const useBudgets = (userId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['budgets', userId],
    queryFn: () => budgetService.getBudget(userId),
    enabled: !!userId,
  });

  const parsedBudget: ParsedBudget = query.data 
    ? JSON.parse(query.data.data) 
    : { items: [], goals: [], income: { monthly: 0, daily: 0 } };

  const updateMutation = useMutation({
    mutationFn: (newBudgetData: ParsedBudget) =>
      budgetService.updateBudget(query.data!.$id, newBudgetData),
    onMutate: async (newBudgetData) => {
      await queryClient.cancelQueries({ queryKey: ['budgets', userId] });
      const previous = queryClient.getQueryData(['budgets', userId]);
      queryClient.setQueryData(['budgets', userId], (old: Budget) => ({
        ...old,
        data: JSON.stringify(newBudgetData)
      }));
      return { previous };
    },
    onError: (err, newBudgetData, context) => {
      queryClient.setQueryData(['budgets', userId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', userId] });
    },
  });

  return {
    ...query,
    budget: parsedBudget,
    updateBudget: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
