import { supabase } from '@/lib/supabase';
import type { DbScheduleCompletion } from '@/types/db';
import { applyWorkoutCompletionReward } from '@/services/gamification.service';

const TABLE = 'schedule_completions';

export async function fetchCompletionsForRange(
  userId: string,
  start: string,
  end: string,
  planId?: string
): Promise<DbScheduleCompletion[]> {
  let q = supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .gte('scheduled_date', start)
    .lte('scheduled_date', end)
    .order('scheduled_date');

  if (planId) q = q.eq('plan_id', planId);

  const { data, error } = await q;
  if (error) {
    console.warn('[schedule] fetch:', error.message);
    return [];
  }
  return (data ?? []) as DbScheduleCompletion[];
}

export async function toggleCompletion(
  userId: string,
  params: {
    planId: string;
    scheduledDate: string;
    dayKey: string;
    completed: boolean;
  }
): Promise<DbScheduleCompletion | null> {
  const { planId, scheduledDate, dayKey, completed } = params;

  const { data: prev } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .eq('scheduled_date', scheduledDate)
    .eq('day_key', dayKey)
    .maybeSingle();

  const wasComplete = Boolean(prev?.completed);

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        user_id: userId,
        plan_id: planId,
        scheduled_date: scheduledDate,
        day_key: dayKey,
        completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,plan_id,scheduled_date,day_key' }
    )
    .select()
    .single();

  if (error) {
    console.warn('[schedule] upsert:', error.message);
    return null;
  }

  if (completed && !wasComplete) {
    try {
      await applyWorkoutCompletionReward(userId, scheduledDate);
    } catch (e) {
      console.warn('[schedule] gamification reward:', e);
    }
  }

  return data as DbScheduleCompletion;
}

export async function fetchCompletionStats(userId: string, daysBack = 56): Promise<{ date: string; count: number }[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysBack);
  const s = start.toISOString().slice(0, 10);
  const e = end.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from(TABLE)
    .select('scheduled_date, completed')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('scheduled_date', s)
    .lte('scheduled_date', e);

  if (error || !data) return [];

  const map = new Map<string, number>();
  for (const row of data as { scheduled_date: string }[]) {
    const d = row.scheduled_date.slice(0, 10);
    map.set(d, (map.get(d) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
