import { motion } from 'framer-motion';
import { LayoutDashboard, Dumbbell, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePlans } from '@/hooks/usePlans';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentPlans } from '@/components/dashboard/RecentPlans';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { GOAL_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export function Dashboard() {
  const { user } = useAuth();
  const { plans, isLoading } = usePlans();

  const totalPlans = plans.length;
  const mostRecentGoal = plans[0]?.goal ? GOAL_LABELS[plans[0].goal] ?? plans[0].goal : '—';
  const lastPlanDate = plans[0]?.created_at ? formatDate(plans[0].created_at) : '—';
  const avgDays = plans.length
    ? Math.round(plans.reduce((sum, p) => sum + p.days_per_week, 0) / plans.length)
    : 0;

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
        {user && <WelcomeBanner user={user} />}

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
