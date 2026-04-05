export interface DbProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface DbWorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  experience: string;
  days_per_week: number;
  duration: number;
  equipment: string;
  body_focus: string;
  skill_focus: string | null;
  injuries: string | null;
  ai_response: object;
  model_used: string | null;
  created_at: string;
}

export interface DbGenerationLog {
  id: string;
  user_id: string | null;
  request_payload: object | null;
  response_status: string | null;
  model_used: string | null;
  error_message: string | null;
  created_at: string;
}

export interface DbUserGamification {
  user_id: string;
  xp: number;
  level: number;
  level_name: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  badges: string[];
  onboarding_completed: boolean;
  updated_at: string;
}

export interface DbCoachMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used: string | null;
  created_at: string;
}

export interface DbScheduleCompletion {
  id: string;
  user_id: string;
  plan_id: string | null;
  scheduled_date: string;
  day_key: string;
  completed: boolean;
  notes: string | null;
  updated_at: string;
}

export interface BmiHistoryPoint {
  at: string;
  bmi: number;
  weight_kg: number;
  height_cm: number;
}

export interface DbProfileExtended extends DbProfile {
  height_cm: number | null;
  weight_kg: number | null;
  age: number | null;
  sex: string | null;
  activity_level: string | null;
  fitness_goal: string | null;
  difficulty_level: string | null;
  bio: string | null;
  bmi_history: BmiHistoryPoint[] | null;
  equipment_preference: string | null;
  weekly_workout_days: number | null;
}
