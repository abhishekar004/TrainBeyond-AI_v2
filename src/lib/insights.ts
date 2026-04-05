import type { DbUserGamification } from '@/types/db';

export type Insight = { title: string; body: string; tone: 'tip' | 'nudge' | 'celebrate' };

/** Rule-based “AI insights” from gamification + optional schedule hints (no LLM latency). */
export function buildAdaptiveInsights(
  g: DbUserGamification | null,
  recentMisses: number
): Insight[] {
  const items: Insight[] = [];

  if (!g) {
    items.push({
      title: 'Welcome aboard',
      body: 'Complete onboarding and log one workout this week to start your streak.',
      tone: 'tip',
    });
    return items;
  }

  if (g.current_streak >= 7) {
    items.push({
      title: 'Consistency on point',
      body: `You're on a ${g.current_streak}-day streak. Keep one light active-recovery day to stay fresh.`,
      tone: 'celebrate',
    });
  } else if (g.current_streak >= 3) {
    items.push({
      title: 'Momentum building',
      body: 'Three days in a row — add 5 minutes of mobility tonight to protect joints.',
      tone: 'celebrate',
    });
  }

  if (recentMisses >= 2) {
    items.push({
      title: 'Gentle reset',
      body: "Missed a couple sessions? Do a 15-minute full-body circuit today — no guilt, just moving.",
      tone: 'nudge',
    });
  }

  const nextLevelXp = Math.max(0, 500 - (g.xp % 500));
  if (g.xp > 0 && g.xp < 300) {
    items.push({
      title: 'Level progress',
      body: `Roughly ${nextLevelXp} XP to your next milestone — finish workouts on Schedule to rack points.`,
      tone: 'tip',
    });
  }

  if (items.length === 0) {
    items.push({
      title: 'Train smart',
      body: 'Try the AI Coach for a quick form cue or meal swap when energy is low.',
      tone: 'tip',
    });
  }

  return items.slice(0, 3);
}
