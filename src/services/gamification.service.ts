import { supabase } from '@/lib/supabase';
import { levelFromXp, type BadgeId } from '@/lib/levelSystem';
import type { DbUserGamification } from '@/types/db';

const TABLE = 'user_gamification';
const XP_PER_SESSION = 25;

function normalize(row: Record<string, unknown>): DbUserGamification {
  const badges = row.badges;
  return {
    user_id: row.user_id as string,
    xp: Number(row.xp ?? 0),
    level: Number(row.level ?? 1),
    level_name: String(row.level_name ?? 'Rookie'),
    current_streak: Number(row.current_streak ?? 0),
    longest_streak: Number(row.longest_streak ?? 0),
    last_activity_date: (row.last_activity_date as string) ?? null,
    badges: Array.isArray(badges) ? (badges as string[]) : [],
    onboarding_completed: Boolean(row.onboarding_completed),
    updated_at: String(row.updated_at ?? ''),
  };
}

export async function ensureGamification(userId: string): Promise<DbUserGamification> {
  const { data: existing, error: selErr } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (selErr) {
    console.warn('[gamification] select:', selErr.message);
  }

  if (existing) return normalize(existing as Record<string, unknown>);

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) {
    // Table may not exist in local dev — return stub so UI does not block on onboarding
    console.warn('[gamification] insert failed (run SQL migrations?):', error.message);
    return {
      user_id: userId,
      xp: 0,
      level: 1,
      level_name: 'Rookie',
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      badges: [],
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };
  }

  return normalize(data as Record<string, unknown>);
}

export async function completeOnboarding(userId: string): Promise<void> {
  const g = await ensureGamification(userId);
  if (g.onboarding_completed) return;

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ onboarding_completed: true, updated_at: now })
    .eq('user_id', userId)
    .select('onboarding_completed')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data?.onboarding_completed) {
    throw new Error('Could not save onboarding completion. Check user_gamification RLS and migrations.');
  }
}

function addBadge(badges: string[], id: BadgeId): string[] {
  if (badges.includes(id)) return badges;
  return [...badges, id];
}

/** Call when a scheduled workout is marked complete (first time for that slot). */
export async function applyWorkoutCompletionReward(
  userId: string,
  activityDate: string
): Promise<DbUserGamification> {
  const g = await ensureGamification(userId);

  const dateStr = activityDate.slice(0, 10);
  const last = g.last_activity_date?.slice(0, 10) ?? null;
  let streak = g.current_streak;
  let longest = g.longest_streak;

  if (!last) {
    streak = 1;
  } else {
    const prev = new Date(last + 'T12:00:00');
    const cur = new Date(dateStr + 'T12:00:00');
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      /* same day — keep streak */
    } else if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  longest = Math.max(longest, streak);
  const newXp = g.xp + XP_PER_SESSION;
  const { level, name } = levelFromXp(newXp);

  let badges = [...g.badges];
  badges = addBadge(badges, 'first_workout');
  if (streak >= 3) badges = addBadge(badges, 'streak_3');
  if (streak >= 7) badges = addBadge(badges, 'streak_7');
  if (newXp >= 500) badges = addBadge(badges, 'xp_500');
  if (newXp >= 1500) badges = addBadge(badges, 'xp_1500');

  const payload = {
    xp: newXp,
    level,
    level_name: name,
    current_streak: streak,
    longest_streak: longest,
    last_activity_date: dateStr,
    badges,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.warn('[gamification] update reward failed:', error.message);
    return { ...g, ...payload, badges, user_id: userId };
  }

  return normalize(data as Record<string, unknown>);
}
