import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { fetchCompletionsForRange } from '@/services/schedule.service';
import { useQuery } from '@tanstack/react-query';
import { HeroLevelXp } from '@/components/home/HeroLevelXp';
import { QuickLinks } from '@/components/home/QuickLinks';
import { AIInsights } from '@/components/home/AIInsights';
import { GamificationCard } from '@/components/home/GamificationCard';
import { PersonalizedPlanGenerator } from '@/components/home/PersonalizedPlanGenerator';
import { buildAdaptiveInsights } from '@/lib/insights';

export function AppHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gamification, isLoading: gLoading } = useGamification();

  useEffect(() => {
    if (gLoading) return;
    if (!gamification) return;
    if (!gamification.onboarding_completed) {
      navigate('/onboarding', { replace: true });
    }
  }, [gLoading, gamification, navigate]);

  const weekRange = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
    };
  }, []);

  const { data: weekRows = [] } = useQuery({
    queryKey: ['schedule-week-misses', user?.id, weekRange.start],
    queryFn: () => fetchCompletionsForRange(user!.id, weekRange.start, weekRange.end),
    enabled: Boolean(user),
  });

  const recentMisses = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return weekRows.filter((r) => !r.completed && r.scheduled_date <= today).length;
  }, [weekRows]);

  const insights = useMemo(
    () => buildAdaptiveInsights(gamification, recentMisses),
    [gamification, recentMisses]
  );

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <PersonalizedPlanGenerator />

        <HeroLevelXp data={gamification} loading={gLoading} />

        <div>
          <h2 className="font-display font-bold text-xl text-text-primary mb-4">Quick links</h2>
          <QuickLinks />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsights insights={insights} />
          <GamificationCard data={gamification} />
        </div>
      </div>
    </div>
  );
}
