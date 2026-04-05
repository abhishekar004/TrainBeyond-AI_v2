import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';
import { TrendingUp } from 'lucide-react';
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
import { fetchCompletionsForRange } from '@/services/schedule.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function Progress() {
  const { user } = useAuth();
  const { gamification } = useGamification();

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
      </div>
    </div>
  );
}
