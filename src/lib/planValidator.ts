import type { GeneratedPlan } from '@/types/workout';

/**
 * Type-guard that validates a parsed object matches the GeneratedPlan shape.
 */
export function validatePlan(plan: unknown): plan is GeneratedPlan {
  if (!plan || typeof plan !== 'object') return false;

  const p = plan as Record<string, unknown>;

  // Check top-level required strings
  if (typeof p.title !== 'string' || p.title.trim() === '') return false;
  if (typeof p.summary !== 'string' || p.summary.trim() === '') return false;

  // Check weekly_plan is a non-empty array
  if (!Array.isArray(p.weekly_plan) || p.weekly_plan.length === 0) return false;

  for (const day of p.weekly_plan) {
    if (!day || typeof day !== 'object') return false;

    const d = day as Record<string, unknown>;

    // Required strings
    if (typeof d.day !== 'string' || d.day.trim() === '') return false;
    if (typeof d.focus !== 'string' || d.focus.trim() === '') return false;

    // warmup: string array
    if (!Array.isArray(d.warmup)) return false;
    for (const w of d.warmup) {
      if (typeof w !== 'string') return false;
    }

    // cooldown: string array
    if (!Array.isArray(d.cooldown)) return false;
    for (const c of d.cooldown) {
      if (typeof c !== 'string') return false;
    }

    // exercises: array with required fields
    if (!Array.isArray(d.exercises) || d.exercises.length === 0) return false;
    for (const ex of d.exercises) {
      if (!ex || typeof ex !== 'object') return false;
      const e = ex as Record<string, unknown>;
      if (typeof e.name !== 'string' || e.name.trim() === '') return false;
      if (typeof e.sets !== 'number' || e.sets <= 0) return false;
      if (typeof e.reps !== 'string') return false;
      if (typeof e.rest !== 'string') return false;
    }
  }

  return true;
}
