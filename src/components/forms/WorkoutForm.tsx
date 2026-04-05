import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import type { WorkoutFormData, Goal, CalisthenicsSkill } from '@/types/workout';
import {
  GOAL_LABELS,
  EXPERIENCE_LABELS,
  EQUIPMENT_LABELS,
  BODY_FOCUS_LABELS,
  SKILL_FOCUS_LABELS,
  DURATION_OPTIONS,
} from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const durationSchema = z.union([
  z.literal(20),
  z.literal(30),
  z.literal(45),
  z.literal(60),
  z.literal(90),
]);

const workoutSchema = z
  .object({
    goal: z.enum(['fat_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness', 'calisthenics']),
    experience: z.enum(['beginner', 'intermediate', 'advanced']),
    days_per_week: z.number().min(2).max(7),
    duration: durationSchema,
    equipment: z.enum(['none', 'home', 'gym']),
    body_focus: z.enum(['full_body', 'upper_body', 'lower_body', 'core', 'push_pull_legs', 'mobility']),
    injuries: z.string().optional(),
    skill_focus: z.enum(['pull_ups', 'push_ups', 'dips', 'handstand', 'muscle_up', 'core_strength', 'full_body_control']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.goal === 'calisthenics' && !data.skill_focus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select a skill focus for calisthenics goal',
        path: ['skill_focus'],
      });
    }
  });

type FormData = z.infer<typeof workoutSchema>;

interface WorkoutFormProps {
  onSubmit: (data: WorkoutFormData) => void;
  isLoading: boolean;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-text-secondary mb-2">{children}</label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-accent-danger text-xs mt-1.5">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
  cols?: number;
}) {
  const gridClass = cols === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map(([val, label]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
            value === val
              ? 'border-accent-primary/60 bg-accent-primary/10 text-accent-primary'
              : 'border-border bg-white/5 text-text-secondary hover:border-accent-primary/30 hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function WorkoutForm({ onSubmit, isLoading }: WorkoutFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      goal: 'general_fitness',
      experience: 'beginner',
      days_per_week: 3,
      duration: 45,
      equipment: 'home',
      body_focus: 'full_body',
    },
  });

  const watchedGoal = watch('goal');
  const watchedExperience = watch('experience');
  const watchedEquipment = watch('equipment');
  const watchedBodyFocus = watch('body_focus');
  const watchedDuration = watch('duration');

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data as WorkoutFormData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Goal */}
      <div>
        <FieldLabel>Training Goal</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(GOAL_LABELS) as [Goal, string][]).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue('goal', val, { shouldValidate: true })}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                watchedGoal === val
                  ? 'border-accent-primary/60 bg-accent-primary/10 text-accent-primary'
                  : 'border-border bg-white/5 text-text-secondary hover:border-accent-primary/30 hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ErrorMsg msg={errors.goal?.message} />
      </div>

      {/* Calisthenics Skill Focus */}
      {watchedGoal === 'calisthenics' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <FieldLabel>Skill Focus</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(SKILL_FOCUS_LABELS) as [CalisthenicsSkill, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setValue('skill_focus', val, { shouldValidate: true })}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                  watch('skill_focus') === val
                    ? 'border-accent-secondary/60 bg-accent-secondary/10 text-accent-secondary'
                    : 'border-border bg-white/5 text-text-secondary hover:border-accent-secondary/30 hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ErrorMsg msg={errors.skill_focus?.message} />
        </motion.div>
      )}

      {/* Experience */}
      <div>
        <FieldLabel>Experience Level</FieldLabel>
        <RadioGroup
          options={Object.entries(EXPERIENCE_LABELS) as ['beginner' | 'intermediate' | 'advanced', string][]}
          value={watchedExperience}
          onChange={(v) => setValue('experience', v, { shouldValidate: true })}
          cols={3}
        />
        <ErrorMsg msg={errors.experience?.message} />
      </div>

      {/* Days per week */}
      <div>
        <FieldLabel>Days per Week: <span className="text-accent-primary">{watch('days_per_week')}</span></FieldLabel>
        <input
          type="range"
          min={2}
          max={7}
          step={1}
          {...register('days_per_week', { valueAsNumber: true })}
          className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent-primary"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          {[2, 3, 4, 5, 6, 7].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <ErrorMsg msg={errors.days_per_week?.message} />
      </div>

      {/* Duration */}
      <div>
        <FieldLabel>Session Duration</FieldLabel>
        <div className="flex gap-2 flex-wrap">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setValue('duration', d, { shouldValidate: true })}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                Number(watchedDuration) === d
                  ? 'border-accent-primary/60 bg-accent-primary/10 text-accent-primary'
                  : 'border-border bg-white/5 text-text-secondary hover:border-accent-primary/30 hover:text-text-primary'
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
        <ErrorMsg msg={errors.duration?.message} />
      </div>

      {/* Equipment */}
      <div>
        <FieldLabel>Equipment Access</FieldLabel>
        <RadioGroup
          options={Object.entries(EQUIPMENT_LABELS) as ['none' | 'home' | 'gym', string][]}
          value={watchedEquipment}
          onChange={(v) => setValue('equipment', v, { shouldValidate: true })}
          cols={3}
        />
        <ErrorMsg msg={errors.equipment?.message} />
      </div>

      {/* Body Focus */}
      <div>
        <FieldLabel>Body Focus</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(BODY_FOCUS_LABELS) as ['full_body' | 'upper_body' | 'lower_body' | 'core' | 'push_pull_legs' | 'mobility', string][]).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setValue('body_focus', val, { shouldValidate: true })}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                watchedBodyFocus === val
                  ? 'border-accent-primary/60 bg-accent-primary/10 text-accent-primary'
                  : 'border-border bg-white/5 text-text-secondary hover:border-accent-primary/30 hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ErrorMsg msg={errors.body_focus?.message} />
      </div>

      {/* Injuries */}
      <div>
        <FieldLabel>Injuries or Limitations <span className="text-text-secondary/50">(optional)</span></FieldLabel>
        <textarea
          {...register('injuries')}
          placeholder="e.g. bad left knee, lower back pain, rotator cuff injury..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border 
                     text-text-primary placeholder:text-text-secondary/50 text-sm
                     focus:outline-none focus:border-accent-primary/60 focus:ring-1 
                     focus:ring-accent-primary/20 resize-none transition-all"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        id="generate-plan-btn"
        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl 
                   bg-gradient-violet text-white font-display font-semibold text-base
                   hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed 
                   transition-all shadow-glow-violet"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            Generating Plan...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate My Plan
          </>
        )}
      </button>
    </motion.form>
  );
}
