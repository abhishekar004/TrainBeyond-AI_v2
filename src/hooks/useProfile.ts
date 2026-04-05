import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { fetchProfileExtended } from '@/services/profile.service';
import type { DbProfileExtended } from '@/types/db';

export function useProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<DbProfileExtended | null> => {
      if (!user) return null;
      return fetchProfileExtended(user.id);
    },
    enabled: Boolean(user),
    staleTime: 1000 * 30,
  });

  return {
    profile: q.data ?? null,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    error: q.error,
    refresh: async () => {
      if (user) await qc.invalidateQueries({ queryKey: ['profile', user.id] });
    },
  };
}
