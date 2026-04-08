import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Dumbbell, Calendar, TrendingUp, Flame, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePlans } from '@/hooks/usePlans';
import { useGamification } from '@/hooks/useGamification';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentPlans } from '@/components/dashboard/RecentPlans';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { GOAL_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Mock weekly sessions data (will be replaced with real data when available)
const MOCK_WEEKLY_DATA = [
  { week: 'Week 1', sessions: 3 },
  { week: 'Week 2', sessions: 4 },
  { week: 'Week 3', sessions: 2 },
  { week: 'Week 4', sessions: 5 },
  { week: 'Week 5', sessions: 4 },
  { week: 'Week 6', sessions: 3 },
  { week: 'Week 7', sessions: 5 },
  { week: 'Week 8', sessions: 4 },
];

export function Dashboard() {
  const { user } = useAuth();
  const { plans, isLoading } = usePlans();
  const { gamification } = useGamification();

  const totalPlans = plans.length;
  const mostRecentGoal = plans[0]?.goal ? GOAL_LABELS[plans[0].goal] ?? plans[0].goal : '—';
  const lastPlanDate = plans[0]?.created_at ? formatDate(plans[0].created_at) : '—';
  const avgDays = plans.length
    ? Math.round(plans.reduce((sum, p) => sum + p.days_per_week, 0) / plans.length)
    : 0;

  const streak = gamification?.current_streak ?? 0;
  const xp = gamification?.xp ?? 0;

  // Consistency score: mock calculation based on streak and XP
  const consistencyScore = useMemo(() => {
    const base = Math.min(streak * 10, 50) + Math.min(Math.floor(xp / 20), 50);
    return Math.min(base, 100);
  }, [streak, xp]);

  // Plan status for the week
  const weekDayTarget = plans[0]?.days_per_week ?? 4;
  const completedThisWeek = Math.min(streak, weekDayTarget);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-5 h-5 text-accent-primary" />
          <h1 className="font-display font-bold text-3xl text-text-primary">Dashboard</h1>
        </div>

        {/* Welcome banner */}
        {user && (
          <WelcomeBanner
            user={user}
            streak={streak}
            consistencyScore={consistencyScore}
            weekProgress={{ completed: completedThisWeek, total: weekDayTarget }}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatsCard
            icon={<Dumbbell className="w-5 h-5" />}
            label="Total Plans"
            value={totalPlans}
            accent="primary"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Latest Goal"
            value={mostRecentGoal}
            accent="secondary"
          />
          <StatsCard
            icon={<Calendar className="w-5 h-5" />}
            label="Last Plan"
            value={lastPlanDate}
            accent="primary"
          />
          <StatsCard
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Avg Days/Week"
            value={avgDays || '—'}
            sub={avgDays ? 'days per week' : undefined}
            accent="secondary"
          />
        </div>

        {/* Weekly Sessions Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-primary" />
                Weekly Sessions
              </CardTitle>
              <CardDescription>Training sessions completed per week</CardDescription>
            </CardHeader>
            <CardContent className="h-64 min-h-[256px] min-w-0">
              <ResponsiveContainer width="100%" height={240} minWidth={0}>
                <BarChart data={MOCK_WEEKLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-text-secondary)" fontSize={12} />
                  <YAxis stroke="var(--color-text-secondary)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 12,
                      color: 'var(--color-text-primary)',
                    }}
                  />
                  <Bar dataKey="sessions" fill="var(--color-accent-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak & XP mini cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl border border-border bg-bg-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Current Streak</p>
              <p className="font-display text-2xl font-bold text-text-primary">{streak} days</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-bg-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20">
              <Zap className="w-5 h-5 text-accent-secondary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total XP</p>
              <p className="font-display text-2xl font-bold text-text-primary">{xp}</p>
            </div>
          </div>
        </div>

        {/* Recent plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-display font-semibold text-xl">Recent Plans</h2>
          </div>
          <RecentPlans plans={plans} />
        </motion.div>
      </div>
    </div>
  );
}
