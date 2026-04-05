import { motion } from 'framer-motion';
import { Save, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';
import { DayCard } from './DayCard';
import type { GeneratedPlan, WorkoutFormData } from '@/types/workout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface PlanResultProps {
  plan: GeneratedPlan;
  form: WorkoutFormData;
  isSaving: boolean;
  savedPlanId: string | null;
  onSave: (form: WorkoutFormData) => void;
  onRegenerate: () => void;
}

export function PlanResult({
  plan,
  form,
  isSaving,
  savedPlanId,
  onSave,
  onRegenerate,
}: PlanResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Plan Header */}
      <div className="rounded-xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/5 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-accent-primary/20">
            <Sparkles className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-text-primary font-display font-bold text-xl leading-tight">
              {plan.title}
            </h2>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">{plan.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-border">
            {plan.weekly_plan.length} days/week
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-border">
            {form.duration} min/session
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-border capitalize">
            {form.experience}
          </span>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {plan.weekly_plan.map((day, i) => (
          <DayCard key={i} day={day} index={i} defaultOpen={i === 0} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={isSaving || !!savedPlanId}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl 
                     bg-accent-primary text-white font-semibold text-sm
                     hover:bg-accent-primary/90 disabled:opacity-60 disabled:cursor-not-allowed 
                     transition-all shadow-glow-violet"
        >
          {isSaving ? (
            <>
              <LoadingSpinner size="sm" />
              Saving...
            </>
          ) : savedPlanId ? (
            <>
              <CheckCircle className="w-4 h-4 text-accent-secondary" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Plan
            </>
          )}
        </button>

        <button
          onClick={onRegenerate}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl 
                     bg-white/5 border border-border text-text-primary font-semibold text-sm
                     hover:bg-white/10 hover:border-accent-primary/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </div>
    </motion.div>
  );
}
