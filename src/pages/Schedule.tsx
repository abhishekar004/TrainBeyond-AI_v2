import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, isBefore, startOfDay } from 'date-fns';
import { CalendarCheck, AlertCircle, Flame, Dumbbell, Wind } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePlans } from '@/hooks/usePlans';
import { fetchCompletionsForRange, toggleCompletion } from '@/services/schedule.service';
import { getIsoWeekSlots, slotIndexForPlanDay } from '@/lib/scheduleHelpers';
import type { SavedPlan, WorkoutDay } from '@/types/workout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ScheduleRow = {
  date: string;
  label: string;
  dayKey: string;
  focus: string;
  workoutDay: WorkoutDay;
};

function buildRowsForPlan(plan: SavedPlan | null): ScheduleRow[] {
  if (!plan?.ai_response?.weekly_plan?.length) return [];
  const slots = getIsoWeekSlots();
  return plan.ai_response.weekly_plan.map((pday, i) => {
    const idx = slotIndexForPlanDay(pday.day) ?? i % 7;
    const slot = slots[idx] ?? slots[i % 7];
    return {
      date: slot.date,
      label: slot.label,
      dayKey: pday.day,
      focus: pday.focus,
      workoutDay: pday,
    };
  });
}

function StatusChip({ status }: { status: 'completed' | 'missed' | 'upcoming' }) {
  const styles = {
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    missed: 'bg-red-500/15 text-red-400 border-red-500/25',
    upcoming: 'bg-white/5 text-text-secondary border-border',
  };
  const labels = { completed: 'Completed', missed: 'Missed', upcoming: 'Upcoming' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function Schedule() {
  const { user } = useAuth();
  const { plans, isLoading } = usePlans();
  const [planId, setPlanId] = useState<string | null>(null);
  const qc = useQueryClient();

  const selectedPlan = plans.find((p) => p.id === planId) ?? plans[0] ?? null;

  useEffect(() => {
    if (!planId && plans[0]?.id) setPlanId(plans[0].id);
  }, [planId, plans]);

  const rows = useMemo(() => buildRowsForPlan(selectedPlan), [selectedPlan]);

  const weekStart = rows[0]?.date ?? format(new Date(), 'yyyy-MM-dd');
  const weekEnd = rows[rows.length - 1]?.date ?? weekStart;

  const { data: completions = [] } = useQuery({
    queryKey: ['schedule', user?.id, selectedPlan?.id, weekStart, weekEnd],
    queryFn: () =>
      fetchCompletionsForRange(user!.id, weekStart, weekEnd, selectedPlan!.id),
    enabled: Boolean(user && selectedPlan),
  });

  const completionMap = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const c of completions) {
      m.set(`${c.scheduled_date}|${c.day_key}`, c.completed);
    }
    return m;
  }, [completions]);

  const today = format(new Date(), 'yyyy-MM-dd');
  const missedPast = useMemo(() => {
    return rows.filter((r) => {
      const done = completionMap.get(`${r.date}|${r.dayKey}`);
      return isBefore(startOfDay(new Date(r.date + 'T12:00:00')), startOfDay(new Date())) && !done;
    }).length;
  }, [rows, completionMap]);

  const mut = useMutation({
    mutationFn: async (args: { date: string; dayKey: string; completed: boolean }) => {
      if (!user || !selectedPlan) throw new Error('noop');
      return toggleCompletion(user.id, {
        planId: selectedPlan.id,
        scheduledDate: args.date,
        dayKey: args.dayKey,
        completed: args.completed,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['schedule', user?.id] });
      qc.invalidateQueries({ queryKey: ['schedule-week-misses', user?.id] });
      qc.invalidateQueries({ queryKey: ['gamification', user?.id] });
    },
    onError: () => toast.error('Could not update completion'),
  });

  function getStatus(row: ScheduleRow): 'completed' | 'missed' | 'upcoming' {
    const key = `${row.date}|${row.dayKey}`;
    const done = completionMap.get(key) ?? false;
    if (done) return 'completed';
    if (row.date < today) return 'missed';
    return 'upcoming';
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary flex items-center gap-2">
            <CalendarCheck className="w-8 h-8 text-accent-secondary" />
            Schedule
          </h1>
          <p className="text-text-secondary text-sm mt-1">This week — toggle workouts as you complete them (+XP).</p>
        </div>

        {plans.length > 1 && (
          <label className="block text-sm text-text-secondary">
            Active plan
            <select
              value={selectedPlan?.id ?? ''}
              onChange={(e) => setPlanId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        )}

        {missedPast > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-accent-secondary/30 bg-accent-secondary/5 p-4 text-sm text-text-primary">
            <AlertCircle className="w-5 h-5 text-accent-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Nudge</p>
              <p className="text-text-secondary mt-1">
                {missedPast} session(s) earlier this week still open — try a 15-minute bodyweight round to stay consistent.
              </p>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Week overview</CardTitle>
            <CardDescription>
              {selectedPlan ? selectedPlan.title : isLoading ? 'Loading plans…' : 'Save a plan from the planner first.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedPlan && !isLoading && (
              <Button asChild variant="secondary">
                <Link to="/planner">Go to planner</Link>
              </Button>
            )}
            {rows.map((r) => {
              const key = `${r.date}|${r.dayKey}`;
              const done = completionMap.get(key) ?? false;
              const isPast = r.date < today;
              const status = getStatus(r);

              return (
                <div
                  key={key}
                  className={cn(
                    'rounded-xl border p-4 transition-all',
                    status === 'completed' && 'border-emerald-500/30 bg-emerald-500/[0.04]',
                    status === 'missed' && 'border-red-500/20 bg-red-500/[0.03]',
                    status === 'upcoming' && 'border-border'
                  )}
                >
                  {/* Day header with status chip */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="font-display font-bold text-text-primary">
                        {r.label}{' '}
                        <span className="text-text-secondary font-normal text-sm">({r.date})</span>
                      </p>
                      <p className="text-sm font-medium text-accent-primary/90 mt-0.5">{r.focus}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusChip status={status} />
                    </div>
                  </div>

                  {/* Structured sections */}
                  <div className="space-y-3">
                    {/* Warm-up */}
                    {r.workoutDay.warmup?.length > 0 && (
                      <div className="pl-3 border-l-2 border-accent-secondary/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-secondary mb-1 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Warm-up
                        </p>
                        <p className="text-xs text-text-secondary">
                          {r.workoutDay.warmup.join(' · ')}
                        </p>
                      </div>
                    )}

                    {/* Exercises */}
                    {(r.workoutDay.exercises?.length ?? 0) > 0 && (
                      <div className="pl-3 border-l-2 border-accent-primary/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-primary mb-1.5 flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" />
                          Exercises
                        </p>
                        <ul className="space-y-1">
                          {r.workoutDay.exercises.map((ex, idx) => (
                            <li key={`${ex.name}-${idx}`} className="text-xs leading-snug">
                              <span className="text-text-primary font-medium">{ex.name}</span>
                              <span className="text-text-secondary font-stat">
                                {' '}— {ex.sets} sets × {ex.reps}
                                {ex.rest ? ` · rest ${ex.rest}` : ''}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cooldown */}
                    {r.workoutDay.cooldown?.length > 0 && (
                      <div className="pl-3 border-l-2 border-blue-400/30">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1">
                          <Wind className="w-3 h-3" />
                          Cooldown
                        </p>
                        <p className="text-xs text-text-secondary">
                          {r.workoutDay.cooldown.join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <Button
                      type="button"
                      variant={done ? 'secondary' : 'default'}
                      size="sm"
                      disabled={mut.isPending}
                      onClick={() => mut.mutate({ date: r.date, dayKey: r.dayKey, completed: !done })}
                    >
                      {done ? 'Completed ✓' : isPast ? 'Log missed → done' : 'Mark complete'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
