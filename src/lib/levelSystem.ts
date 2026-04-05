/** Named levels from cumulative XP thresholds (tunable product curve). */
const LEVELS: { name: string; minXp: number }[] = [
  { name: 'Rookie', minXp: 0 },
  { name: 'Mover', minXp: 100 },
  { name: 'Athlete', minXp: 300 },
  { name: 'Dedicated', minXp: 700 },
  { name: 'Elite', minXp: 1500 },
  { name: 'Champion', minXp: 3000 },
  { name: 'Legend', minXp: 6000 },
];

export function xpForNextLevel(currentLevel: number): number {
  const idx = Math.min(Math.max(currentLevel - 1, 0), LEVELS.length - 1);
  const next = LEVELS[idx + 1];
  return next ? next.minXp : LEVELS[idx].minXp + 5000;
}

export function levelFromXp(xp: number): { level: number; name: string; minXp: number; nextMinXp: number } {
  let level = 1;
  let name = LEVELS[0].name;
  let minXp = LEVELS[0].minXp;
  let nextMinXp = LEVELS[1]?.minXp ?? LEVELS[0].minXp + 500;

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      level = i + 1;
      name = LEVELS[i].name;
      minXp = LEVELS[i].minXp;
      nextMinXp = LEVELS[i + 1]?.minXp ?? minXp + 5000;
      break;
    }
  }

  return { level, name, minXp, nextMinXp };
}

export const BADGE_DEFINITIONS = [
  { id: 'first_workout', label: 'First Step', desc: 'Complete your first scheduled workout' },
  { id: 'streak_3', label: 'On Fire', desc: '3-day training streak' },
  { id: 'streak_7', label: 'Week Warrior', desc: '7-day streak' },
  { id: 'xp_500', label: 'Point Collector', desc: 'Earn 500 XP' },
  { id: 'xp_1500', label: 'Grinder', desc: 'Earn 1500 XP' },
] as const;

export type BadgeId = (typeof BADGE_DEFINITIONS)[number]['id'];
