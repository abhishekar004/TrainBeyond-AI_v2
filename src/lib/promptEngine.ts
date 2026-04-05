import type { WorkoutFormData } from '@/types/workout';
import { GOAL_LABELS, EQUIPMENT_LABELS, BODY_FOCUS_LABELS, SKILL_FOCUS_LABELS } from '@/lib/constants';

const JSON_SCHEMA = `{
  "title": "string (descriptive plan name)",
  "summary": "string (2-3 sentence overview of the plan)",
  "weekly_plan": [
    {
      "day": "string (e.g. Monday, Day 1)",
      "focus": "string (e.g. Upper Body Strength)",
      "warmup": ["string", "string", "string"],
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": "string (e.g. '8-12' or '30 seconds')",
          "rest": "string (e.g. '60 seconds')"
        }
      ],
      "cooldown": ["string", "string", "string"]
    }
  ]
}`;

const GOAL_INSTRUCTIONS: Record<string, string> = {
  fat_loss: `Focus on metabolic conditioning and calorie burn. Use circuits, supersets, and compound movements. Keep rest periods short (30–60 seconds). Prioritize full-body movements that elevate heart rate. Include HIIT-style finishers where possible.`,
  muscle_gain: `Focus on hypertrophy. Prescribe 3–5 sets of 8–12 reps per exercise. Use progressive overload principles. Include both compound lifts and isolation exercises. Rest 60–90 seconds between sets. Include mind-muscle connection cues.`,
  strength: `Focus on maximal strength. Prescribe 4–6 sets of 3–6 reps for main compounds. Use longer rest periods (2–4 minutes). Prioritize squat, deadlift, bench press, overhead press, and rows. Include warm-up sets progression.`,
  endurance: `Focus on muscular and cardiovascular endurance. Prescribe high reps (15–25), minimal rest (20–40 seconds). Use circuit training, EMOM, and AMRAP formats. Include aerobic conditioning components.`,
  general_fitness: `Focus on well-rounded fitness. Balance strength, cardio, mobility, and skill work. Prescribe moderate reps (10–15), moderate rest (45–60 seconds). Include variety to keep sessions engaging.`,
  calisthenics: `Focus on bodyweight mastery and skill development. Use progressive calisthenics (regression to progression variants). Include fundamental patterns: push, pull, squat, hinge, core, and locomotion. Build toward advanced skills with structured progressions.`,
};

export function buildWorkoutPrompt(form: WorkoutFormData): {
  systemPrompt: string;
  userPrompt: string;
} {
  const goalInstruction = GOAL_INSTRUCTIONS[form.goal] || GOAL_INSTRUCTIONS.general_fitness;
  const goalLabel = GOAL_LABELS[form.goal] || form.goal;
  const equipmentLabel = EQUIPMENT_LABELS[form.equipment] || form.equipment;
  const bodyFocusLabel = BODY_FOCUS_LABELS[form.body_focus] || form.body_focus;

  const systemPrompt = `You are an elite fitness coach and workout programmer with 20 years of experience. 
You generate highly personalized, science-backed workout plans.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON. No markdown. No explanation. No code blocks. No text before or after.
- The JSON must exactly match this schema:
${JSON_SCHEMA}

- Every workout day MUST have: day, focus, warmup (3-5 items), exercises (4-8 exercises), cooldown (3-5 items)
- Exercise reps must be a STRING (e.g., "8-12", "10", "30 seconds", "AMRAP")
- Exercise sets must be a NUMBER
- Rest must be a STRING (e.g., "60 seconds", "90 seconds", "2 minutes")
- The weekly_plan array must have EXACTLY ${form.days_per_week} entries
- Each session must be designed to fit within ${form.duration} minutes
- Return ONLY the JSON object, nothing else.`;

  let userPrompt = `Generate a complete ${form.days_per_week}-day per week workout plan with the following specifications:

**Goal:** ${goalLabel}
**Experience Level:** ${form.experience}
**Session Duration:** ${form.duration} minutes per session
**Equipment Available:** ${equipmentLabel}
**Body Focus:** ${bodyFocusLabel}
**Days per Week:** ${form.days_per_week}

**Training Philosophy for this goal:**
${goalInstruction}`;

  if (form.goal === 'calisthenics' && form.skill_focus) {
    const skillLabel = SKILL_FOCUS_LABELS[form.skill_focus] || form.skill_focus;
    userPrompt += `

**Primary Skill Focus:** ${skillLabel}
Include specific progressions and drills to develop ${skillLabel}. Add skill-specific drills to at least ${Math.max(2, Math.floor(form.days_per_week / 2))} sessions.`;
  }

  if (form.injuries) {
    userPrompt += `

**Injuries / Limitations to AVOID:** ${form.injuries}
You MUST design ALL exercises around these limitations. Provide safe alternatives. Do not include any exercise that aggravates the listed injuries.`;
  }

  userPrompt += `

**Additional Requirements:**
- Match all exercise difficulty to ${form.experience} level
- Ensure progressive overload potential across the week
- Include warm-up and cooldown for every session
- Make the plan engaging, varied, and sustainable

Return ONLY the JSON object. No preamble. No explanation.`;

  return { systemPrompt, userPrompt };
}
