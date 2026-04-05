import type { GeneratedPlan, WorkoutDay, WorkoutFormData } from '@/types/workout';
import { BODY_FOCUS_LABELS, EQUIPMENT_LABELS, EXPERIENCE_LABELS, GOAL_LABELS } from '@/lib/constants';

/**
 * Three rotating day templates (strength → conditioning → recovery).
 * Repeated when the user requests more than 3 training days per week.
 */
const ROTATION_TEMPLATES: WorkoutDay[] = [
  {
    day: 'Day 1',
    focus: 'Full Body Strength',
    warmup: [
      '5 min light jog or jumping jacks',
      'Arm circles (10 each direction)',
      'Hip circles (10 each direction)',
      'Bodyweight squats x 10',
    ],
    exercises: [
      { name: 'Push-Ups', sets: 3, reps: '10-15', rest: '60 seconds' },
      { name: 'Bodyweight Squats', sets: 3, reps: '15-20', rest: '60 seconds' },
      { name: 'Dumbbell Rows (or Bent-over rows)', sets: 3, reps: '10-12', rest: '60 seconds' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60 seconds' },
      { name: 'Plank Hold', sets: 3, reps: '30-45 seconds', rest: '45 seconds' },
      { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: '45 seconds' },
    ],
    cooldown: [
      'Standing quad stretch (30 sec each)',
      "Doorframe chest stretch (30 sec)",
      "Child's pose (60 sec)",
      'Seated hamstring stretch (30 sec each)',
    ],
  },
  {
    day: 'Day 2',
    focus: 'Cardio & Core',
    warmup: [
      '3 min brisk walk or march in place',
      'Leg swings (10 each direction)',
      'Torso rotations x 10',
    ],
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: '45 seconds', rest: '15 seconds' },
      { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', rest: '30 seconds' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: '45 seconds' },
      { name: 'High Knees', sets: 3, reps: '40 seconds', rest: '20 seconds' },
      { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '45 seconds' },
      { name: 'Burpees', sets: 3, reps: '8-10', rest: '60 seconds' },
    ],
    cooldown: [
      'Cat-Cow stretch x 10',
      'Supine spinal twist (30 sec each)',
      'Diaphragmatic breathing (2 min)',
    ],
  },
  {
    day: 'Day 3',
    focus: 'Mobility & Active Recovery',
    warmup: [
      '5 min easy walk',
      'Neck rolls (5 each direction)',
      'Shoulder rolls x 10',
    ],
    exercises: [
      { name: "World's Greatest Stretch", sets: 2, reps: '5 each side', rest: '30 seconds' },
      { name: 'Hip Flexor Stretch (kneeling)', sets: 2, reps: '45 sec each side', rest: '30 seconds' },
      { name: 'Wall Angels', sets: 3, reps: '10', rest: '30 seconds' },
      { name: 'Thoracic Rotation', sets: 2, reps: '10 each side', rest: '20 seconds' },
      { name: 'Pigeon Pose', sets: 2, reps: '60 sec each side', rest: '30 seconds' },
      { name: 'Dead Bug', sets: 3, reps: '10 total', rest: '45 seconds' },
    ],
    cooldown: [
      'Full body roll-down (3x)',
      'Happy baby pose (60 sec)',
      'Savasana / deep breathing (3 min)',
    ],
  },
];

function cloneDay(template: WorkoutDay, dayNumber: number, repeatBlock: number): WorkoutDay {
  const copy = JSON.parse(JSON.stringify(template)) as WorkoutDay;
  copy.day = `Day ${dayNumber}`;
  const suffix = repeatBlock > 0 ? ` (week block ${repeatBlock + 1})` : '';
  copy.focus = `${template.focus}${suffix}`;
  return copy;
}

/**
 * Offline fallback when all OpenRouter attempts fail. Mirrors the user's days/week,
 * goal, duration, equipment, and body focus in title/summary so the UI stays consistent.
 */
export function getFallbackPlan(form: WorkoutFormData): GeneratedPlan {
  const n = Math.min(7, Math.max(2, Math.round(Number(form.days_per_week)) || 3));
  const weekly_plan: WorkoutDay[] = [];

  for (let i = 0; i < n; i++) {
    const template = ROTATION_TEMPLATES[i % ROTATION_TEMPLATES.length]!;
    const repeatBlock = Math.floor(i / ROTATION_TEMPLATES.length);
    weekly_plan.push(cloneDay(template, i + 1, repeatBlock));
  }

  const goalLabel = GOAL_LABELS[form.goal] ?? 'Training';
  const expLabel = EXPERIENCE_LABELS[form.experience] ?? form.experience;
  const equipLabel = EQUIPMENT_LABELS[form.equipment] ?? form.equipment;
  const focusLabel = BODY_FOCUS_LABELS[form.body_focus] ?? form.body_focus;

  return {
    title: `${goalLabel} · ${n}-day starter plan`,
    summary: `A ${n}-day rotating plan (${focusLabel}) for ${goalLabel.toLowerCase()} — ${expLabel}, ~${form.duration} min per session, ${equipLabel}. Each ~3-day block cycles full-body strength, cardio & core, then mobility so you still get structure while AI generation is unavailable.`,
    weekly_plan,
  };
}
