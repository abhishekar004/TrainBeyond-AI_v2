export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

/** Groq OpenAI-compatible API (fast inference). https://console.groq.com/docs/models */
export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Workout planner: Groq models tried first when `VITE_GROQ_API_KEY` is set.
 */
export const GROQ_MODEL_CHAIN = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
] as const;

/**
 * Models tried in order when Groq is unavailable or fails (AI coach may still use OpenRouter only).
 */
export const OPENROUTER_MODEL_CHAIN = [
  'openrouter/free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
] as const;

/** Default label for saves when no remote model ran (metadata / display). */
export const PRIMARY_MODEL = 'groq:llama-3.3-70b-versatile';
export const FALLBACK_MODEL = OPENROUTER_MODEL_CHAIN[OPENROUTER_MODEL_CHAIN.length - 1];
export const MAX_RETRIES = 2;

export const GOAL_LABELS: Record<string, string> = {
  fat_loss: 'Fat Loss',
  muscle_gain: 'Muscle Gain',
  strength: 'Strength',
  endurance: 'Endurance',
  general_fitness: 'General Fitness',
  calisthenics: 'Calisthenics',
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  none: 'No Equipment (Bodyweight)',
  home: 'Home Equipment',
  gym: 'Full Gym Access',
};

export const BODY_FOCUS_LABELS: Record<string, string> = {
  full_body: 'Full Body',
  upper_body: 'Upper Body',
  lower_body: 'Lower Body',
  core: 'Core',
  push_pull_legs: 'Push / Pull / Legs',
  mobility: 'Mobility & Flexibility',
};

export const SKILL_FOCUS_LABELS: Record<string, string> = {
  pull_ups: 'Pull-Ups',
  push_ups: 'Push-Ups',
  dips: 'Dips',
  handstand: 'Handstand',
  muscle_up: 'Muscle-Up',
  core_strength: 'Core Strength',
  full_body_control: 'Full Body Control',
};

export const DURATION_OPTIONS = [20, 30, 45, 60, 90] as const;
export const DAYS_OPTIONS = [2, 3, 4, 5, 6, 7] as const;
