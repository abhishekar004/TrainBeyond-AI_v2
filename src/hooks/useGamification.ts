import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { ensureGamification } from '@/services/gamification.service';
import type { DbUserGamification } from '@/types/db';

export function useGamification() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['gamification', user?.id],
    queryFn: async (): Promise<DbUserGamification> => {
      if (!user) {
        throw new Error('No user');
      }
      return ensureGamification(user.id);
    },
    enabled: Boolean(user),
    staleTime: 1000 * 30,
  });

  return {
    gamification: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refresh: () => user && qc.invalidateQueries({ queryKey: ['gamification', user.id] }),
  };
}
