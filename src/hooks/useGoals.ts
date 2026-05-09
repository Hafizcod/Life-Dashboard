import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/goalService';
import { ParsedGoal, Goal, GoalItem } from '../types/models';

export const useGoals = (userId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => goalService.getGoals(userId),
    enabled: !!userId,
  });

  const goals: ParsedGoal = query.data 
    ? JSON.parse(query.data.data) 
    : { active: [], notStarted: [], done: [] };

  const updateMutation = useMutation({
    mutationFn: (newGoalsData: ParsedGoal) =>
      goalService.updateGoals(query.data!.$id, newGoalsData),
    onMutate: async (newGoalsData) => {
      await queryClient.cancelQueries({ queryKey: ['goals', userId] });
      const previous = queryClient.getQueryData(['goals', userId]);
      queryClient.setQueryData(['goals', userId], (old: Goal) => ({
        ...old,
        data: JSON.stringify(newGoalsData)
      }));
      return { previous };
    },
    onError: (err, newGoalsData, context) => {
      queryClient.setQueryData(['goals', userId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });

  return {
    ...query,
    goals,
    updateGoals: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
