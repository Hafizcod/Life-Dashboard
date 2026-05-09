import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/models';

export const useCategories = (userId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['categories', userId],
    queryFn: () => categoryService.getCategories(userId),
    enabled: !!userId,
  });

  const addMutation = useMutation({
    mutationFn: (category: Omit<Category, keyof import('appwrite').Models.Document>) =>
      categoryService.addCategory(userId, category),
    onMutate: async (newCat) => {
      await queryClient.cancelQueries({ queryKey: ['categories', userId] });
      const previous = queryClient.getQueryData(['categories', userId]);
      queryClient.setQueryData(['categories', userId], (old: Category[] = []) => [
        ...old,
        { ...newCat, $id: 'temp-' + Date.now() } as Category,
      ]);
      return { previous };
    },
    onError: (err, newCat, context) => {
      queryClient.setQueryData(['categories', userId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] });
    },
  });

  return {
    ...query,
    addCategory: addMutation.mutate,
    isAdding: addMutation.isPending,
  };
};
