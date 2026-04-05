import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { generateWorkoutPlan } from '@/services/ai.service';
import { savePlan } from '@/services/plans.service';
import { useAuth } from '@/hooks/useAuth';
import { PRIMARY_MODEL } from '@/lib/constants';
import type { WorkoutFormData, GeneratedPlan } from '@/types/workout';

export function useGeneratePlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [modelUsedForPlan, setModelUsedForPlan] = useState<string>(PRIMARY_MODEL);
  const [isSaving, setIsSaving] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async (form: WorkoutFormData) => {
      if (!user) throw new Error('Not authenticated');
      return generateWorkoutPlan(form, user.id);
    },
    onSuccess: ({ plan, modelUsed }) => {
      setCurrentPlan(plan);
      setModelUsedForPlan(modelUsed);
      setSavedPlanId(null);
      toast.success('Workout plan generated!');
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Couldn't generate your plan. ${msg}`);
    },
  });

  const handleSave = async (form: WorkoutFormData) => {
    if (!user || !currentPlan) return;
    setIsSaving(true);
    try {
      const saved = await savePlan(form, currentPlan, modelUsedForPlan, user.id);
      setSavedPlanId(saved.id);
      toast.success('Plan saved successfully!');
      await queryClient.invalidateQueries({ queryKey: ['plans', user.id] });
    } catch (err) {
      console.error('[useGeneratePlan] Save failed:', err);
      toast.error('Plan generated but couldn\'t be saved. You can still view it.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    currentPlan,
    savedPlanId,
    modelUsedForPlan,
    isSaving,
    isGenerating: generateMutation.isPending,
    generate: generateMutation.mutate,
    save: handleSave,
    reset: () => {
      setCurrentPlan(null);
      setSavedPlanId(null);
      setModelUsedForPlan(PRIMARY_MODEL);
    },
  };
}
