export type Goal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'strength'
  | 'endurance'
  | 'general_fitness'
  | 'calisthenics';

export type Experience = 'beginner' | 'intermediate' | 'advanced';

export type Equipment = 'none' | 'home' | 'gym';

export type BodyFocus =
  | 'full_body'
  | 'upper_body'
  | 'lower_body'
  | 'core'
  | 'push_pull_legs'
  | 'mobility';

export type CalisthenicsSkill =
  | 'pull_ups'
  | 'push_ups'
  | 'dips'
  | 'handstand'
  | 'muscle_up'
  | 'core_strength'
  | 'full_body_control';

export interface WorkoutFormData {
  goal: Goal;
  experience: Experience;
  days_per_week: number;
  duration: 20 | 30 | 45 | 60 | 90;
  equipment: Equipment;
  body_focus: BodyFocus;
  injuries?: string;
  skill_focus?: CalisthenicsSkill;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

export interface GeneratedPlan {
  title: string;
  summary: string;
  weekly_plan: WorkoutDay[];
}

export interface SavedPlan extends WorkoutFormData {
  id: string;
  user_id: string;
  title: string;
  ai_response: GeneratedPlan;
  model_used: string;
  created_at: string;
}
