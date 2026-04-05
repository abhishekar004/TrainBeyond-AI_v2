import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchPlans, deletePlan } from '@/services/plans.service';
import { useAuth } from '@/hooks/useAuth';

export function usePlans() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const plansQuery = useQuery({
    queryKey: ['plans', user?.id],
    queryFn: () => fetchPlans(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 min
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      toast.success('Plan deleted.');
      queryClient.invalidateQueries({ queryKey: ['plans', user?.id] });
    },
    onError: () => {
      toast.error('Failed to delete plan. Please try again.');
    },
  });

  return {
    plans: plansQuery.data ?? [],
    isLoading: plansQuery.isLoading,
    isError: plansQuery.isError,
    deletePlan: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: plansQuery.refetch,
  };
}
