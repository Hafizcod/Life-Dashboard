import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService } from '../services/investmentService';
import { ParsedInvestment, Investment, InvestmentItem } from '../types/models';

export const useInvestments = (userId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['investments', userId],
    queryFn: () => investmentService.getInvestments(userId),
    enabled: !!userId,
  });

  const investments: ParsedInvestment = query.data 
    ? JSON.parse(query.data.data) 
    : { active: [], notStarted: [], done: [] };

  const updateMutation = useMutation({
    mutationFn: (newInvestmentsData: ParsedInvestment) =>
      investmentService.updateInvestments(query.data!.$id, newInvestmentsData),
    onMutate: async (newInvestmentsData) => {
      await queryClient.cancelQueries({ queryKey: ['investments', userId] });
      const previous = queryClient.getQueryData(['investments', userId]);
      queryClient.setQueryData(['investments', userId], (old: Investment) => ({
        ...old,
        data: JSON.stringify(newInvestmentsData)
      }));
      return { previous };
    },
    onError: (err, newInvestmentsData, context) => {
      queryClient.setQueryData(['investments', userId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['investments', userId] });
    },
  });

  return {
    ...query,
    investments,
    updateInvestments: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
