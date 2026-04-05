/**
 * Curated exercise names for documentation, UI hints, and future prompt enrichment.
 * Not exhaustive — the AI may suggest additional movements.
 */
export const EXERCISE_LIBRARY = {
  compound: [
    'Barbell back squat',
    'Front squat',
    'Romanian deadlift',
    'Conventional deadlift',
    'Bench press',
    'Overhead press',
    'Barbell row',
    'Pull-up',
    'Dip',
  ],
  accessories: [
    'Bulgarian split squat',
    'Walking lunge',
    'Leg press',
    'Leg curl',
    'Leg extension',
    'Cable row',
    'Lat pulldown',
    'Face pull',
    'Lateral raise',
    'Triceps pushdown',
    'Hammer curl',
  ],
  calisthenics: [
    'Push-up progression',
    'Inverted row',
    'Pike push-up',
    'Hollow body hold',
    'Arch body hold',
    'L-sit progression',
    'Skin the cat',
    'Handstand wall hold',
  ],
  conditioning: [
    'Burpee',
    'Jump rope',
    'Kettlebell swing',
    'Assault bike',
    'Row erg',
    'Sled push',
  ],
} as const;

export type ExerciseCategory = keyof typeof EXERCISE_LIBRARY;
