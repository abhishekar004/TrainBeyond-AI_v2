import { supabase } from '@/lib/supabase';
import type { WorkoutFormData, GeneratedPlan, SavedPlan } from '@/types/workout';

export async function savePlan(
  form: WorkoutFormData,
  plan: GeneratedPlan,
  modelUsed: string,
  userId: string
): Promise<SavedPlan> {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert({
      user_id: userId,
      title: plan.title,
      goal: form.goal,
      experience: form.experience,
      days_per_week: form.days_per_week,
      duration: form.duration,
      equipment: form.equipment,
      body_focus: form.body_focus,
      skill_focus: form.skill_focus ?? null,
      injuries: form.injuries ?? null,
      ai_response: plan as unknown as object,
      model_used: modelUsed,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save plan: ${error.message}`);
  }

  return data as unknown as SavedPlan;
}

export async function fetchPlans(userId: string): Promise<SavedPlan[]> {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch plans: ${error.message}`);
  }

  return (data ?? []) as unknown as SavedPlan[];
}

export async function deletePlan(planId: string): Promise<void> {
  const { error } = await supabase
    .from('workout_plans')
    .delete()
    .eq('id', planId);

  if (error) {
    throw new Error(`Failed to delete plan: ${error.message}`);
  }
}

export async function fetchPlanById(planId: string): Promise<SavedPlan | null> {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (error) return null;
  return data as unknown as SavedPlan;
}
