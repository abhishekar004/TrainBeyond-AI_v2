import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';
import { TrendingUp, Trophy, Lock, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { usePlans } from '@/hooks/usePlans';
import { fetchCompletionsForRange } from '@/services/schedule.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ACHIEVEMENT_BADGES = [
  {
    id: 'first_workout',
    label: 'First Workout',
    desc: 'Complete your first scheduled workout',
    icon: '🏋️',
    threshold: 'Complete 1 workout',
  },
  {
    id: 'streak_3',
    label: '3-Day Streak',
    desc: 'Train 3 days in a row',
    icon: '🔥',
    threshold: '3 consecutive days',
  },
  {
    id: 'xp_500',
    label: '100 XP',
    desc: 'Earn your first 100 XP',
    icon: '⚡',
    threshold: 'Earn 100 XP',
    checkXp: 100,
  },
  {
    id: 'first_saved_plan',
    label: 'First Saved Plan',
    desc: 'Save your first AI-generated plan',
    icon: '📋',
    threshold: 'Save 1 plan',
  },
];

export function Progress() {
  const { user } = useAuth();
  const { gamification } = useGamification();
  const { plans } = usePlans();

  const end = format(new Date(), 'yyyy-MM-dd');
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 56);
  const start = format(startDate, 'yyyy-MM-dd');

  const { data: rows = [] } = useQuery({
    queryKey: ['progress-raw', user?.id, start, end],
    queryFn: () => fetchCompletionsForRange(user!.id, start, end),
    enabled: Boolean(user),
  });

  const completedRows = useMemo(
    () => rows.filter((r) => r.completed),
    [rows]
  );

  const byWeek = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of completedRows) {
      const wk = format(startOfWeek(new Date(r.scheduled_date + 'T12:00:00'), { weekStartsOn: 1 }), 'MMM d');
      map.set(wk, (map.get(wk) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([week, sessions]) => ({ week, sessions }));
  }, [completedRows]);

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of completedRows) {
      const d = r.scheduled_date.slice(0, 10);
      map.set(d, (map.get(d) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, n]) => ({ date, n }))
      .slice(-21);
  }, [completedRows]);

  // Determine which achievements are unlocked
  const badges = gamification?.badges ?? [];
  const xp = gamification?.xp ?? 0;

  function isBadgeUnlocked(badge: (typeof ACHIEVEMENT_BADGES)[number]) {
    if (badges.includes(badge.id)) return true;
    if (badge.id === 'first_saved_plan' && plans.length > 0) return true;
    if (badge.checkXp && xp >= badge.checkXp) return true;
    return false;
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-accent-primary" />
            Progress
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Analytics from schedule completions (Recharts). Link plans in Schedule to populate data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Total XP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-accent-primary">{gamification?.xp ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Current streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-accent-secondary">{gamification?.current_streak ?? 0}d</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">Sessions (window)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-text-primary">{completedRows.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed sessions by week</CardTitle>
            <CardDescription>Last ~8 weeks of toggled completions.</CardDescription>
          </CardHeader>
          <CardContent className="h-80 min-h-[320px] min-w-0">
            {byWeek.length === 0 ? (
              <p className="text-text-secondary text-sm">No data yet — mark workouts on the Schedule page.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320} minWidth={0}>
                <BarChart data={byWeek}>
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent daily volume</CardTitle>
            <CardDescription>Last 21 days with at least one completion (count).</CardDescription>
          </CardHeader>
          <CardContent className="h-72 min-h-[288px] min-w-0">
            {byDay.length === 0 ? (
              <p className="text-text-secondary text-sm">No per-day data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={288} minWidth={0}>
                <LineChart data={byDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--color-text-secondary)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="n" stroke="var(--color-accent-secondary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <div>
          <h2 className="font-display font-bold text-xl text-text-primary flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-accent-primary" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACHIEVEMENT_BADGES.map((badge, i) => {
              const unlocked = isBadgeUnlocked(badge);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative rounded-2xl border p-5 text-center transition-all ${
                    unlocked
                      ? 'border-accent-primary/40 bg-gradient-to-br from-accent-primary/10 via-bg-card to-accent-secondary/5 shadow-glow-violet'
                      : 'border-border bg-bg-card opacity-60'
                  }`}
                >
                  {/* Lock overlay for locked badges */}
                  {!unlocked && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-4 h-4 text-text-secondary/50" />
                    </div>
                  )}
                  {unlocked && (
                    <div className="absolute top-3 right-3">
                      <Sparkles className="w-4 h-4 text-accent-primary" />
                    </div>
                  )}

                  <div className="text-3xl mb-3">{badge.icon}</div>
                  <h3 className={`font-display font-bold text-sm mb-1 ${unlocked ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {badge.label}
                  </h3>
                  <p className="text-xs text-text-secondary">{badge.desc}</p>
                  <p className={`text-[10px] mt-2 ${unlocked ? 'text-accent-secondary font-semibold' : 'text-text-secondary/60'}`}>
                    {unlocked ? '✓ Unlocked' : badge.threshold}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
