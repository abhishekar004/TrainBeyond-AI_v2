export type Sex = 'male' | 'female';
export type Goal = 'cut' | 'maintain' | 'bulk';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

const ACTIVITY_MULT: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

/** Mifflin–St Jeor BMR (kcal/day) */
export function bmrMifflin(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function tdeeFromBmr(bmr: number, activity: Activity): number {
  return Math.round(bmr * ACTIVITY_MULT[activity]);
}

/** Returns target calories and macro grams (protein / carbs / fat) for goal. */
export function macrosFromTdee(tdee: number, weightKg: number, goal: Goal) {
  let calories = tdee;
  if (goal === 'cut') calories = Math.round(tdee * 0.85);
  if (goal === 'bulk') calories = Math.round(tdee * 1.1);

  const proteinG = Math.round(Math.min(weightKg * 2, weightKg * 1.6 + 20));
  const fatG = Math.round(weightKg * 0.9);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = Math.max(calories - proteinKcal - fatKcal, 0);
  const carbG = Math.round(carbKcal / 4);

  return { calories, proteinG, carbsG: carbG, fatG };
}
