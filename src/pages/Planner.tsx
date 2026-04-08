import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Sparkles, Target, Calendar, Clock, Layers, Zap } from 'lucide-react';
import { WorkoutForm } from '@/components/forms/WorkoutForm';
import { PlanResult } from '@/components/planner/PlanResult';
import { PlanSkeleton } from '@/components/planner/PlanSkeleton';
import { useGeneratePlan } from '@/hooks/useGeneratePlan';
import { GOAL_LABELS, EQUIPMENT_LABELS, BODY_FOCUS_LABELS } from '@/lib/constants';
import type { WorkoutFormData } from '@/types/workout';

export function Planner() {
  const { currentPlan, savedPlanId, isSaving, isGenerating, generate, save, reset } = useGeneratePlan();
  const [lastForm, setLastForm] = useState<WorkoutFormData | null>(null);
  const [liveValues, setLiveValues] = useState<Partial<WorkoutFormData>>({});

  const handleGenerate = (form: WorkoutFormData) => {
    setLastForm(form);
    generate(form);
  };

  const handleRegenerate = () => {
    if (lastForm) {
      reset();
      generate(lastForm);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-violet">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl text-text-primary">AI Planner</h1>
          </div>
          <p className="text-text-secondary ml-12">
            Configure your profile and let AI build your perfect training week.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form column */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <h2 className="text-text-primary font-display font-semibold">Your Profile</h2>
            </div>
            <WorkoutForm
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              onValuesChange={setLiveValues}
            />
          </div>

          {/* Result column */}
          <div>
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-2 mb-4 text-text-secondary text-sm">
                    <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                    AI is crafting your personalized plan...
                  </div>
                  <PlanSkeleton />
                </motion.div>
              ) : currentPlan ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PlanResult
                    plan={currentPlan}
                    form={lastForm!}
                    isSaving={isSaving}
                    savedPlanId={savedPlanId}
                    onSave={save}
                    onRegenerate={handleRegenerate}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Live Plan Preview Panel */}
                  <div className="rounded-2xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/[0.06] via-bg-card to-bg-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary">
                        Live Plan Preview
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <PreviewChip
                        icon={Target}
                        label="Goal"
                        value={GOAL_LABELS[liveValues.goal ?? 'general_fitness'] ?? 'General Fitness'}
                      />
                      <PreviewChip
                        icon={Layers}
                        label="Split"
                        value={BODY_FOCUS_LABELS[liveValues.body_focus ?? 'full_body'] ?? 'Full Body'}
                      />
                      <PreviewChip
                        icon={Calendar}
                        label="Days"
                        value={`${liveValues.days_per_week ?? 3} days/week`}
                      />
                      <PreviewChip
                        icon={Clock}
                        label="Duration"
                        value={`${liveValues.duration ?? 45} min`}
                      />
                      <PreviewChip
                        icon={Zap}
                        label="Style"
                        value={EQUIPMENT_LABELS[liveValues.equipment ?? 'home'] ?? 'Home Equipment'}
                        span
                      />
                    </div>
                  </div>

                  {/* Empty state */}
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-6 rounded-3xl bg-accent-primary/5 border border-accent-primary/10 mb-6">
                      <Dumbbell className="w-12 h-12 text-accent-primary/40" />
                    </div>
                    <h3 className="text-text-primary font-display font-semibold text-xl mb-2">
                      Your Plan Awaits
                    </h3>
                    <p className="text-text-secondary text-sm max-w-xs">
                      Fill out your profile on the left and click "Generate My Plan" to get started.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewChip({
  icon: Icon,
  label,
  value,
  span,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-border bg-white/[0.04] p-3 ${
        span ? 'col-span-2' : ''
      }`}
    >
      <div className="p-1.5 rounded-lg bg-accent-primary/10">
        <Icon className="w-3.5 h-3.5 text-accent-primary" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-secondary">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}
