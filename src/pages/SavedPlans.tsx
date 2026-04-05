import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trash2, ChevronDown, AlertTriangle } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { DayCard } from '@/components/planner/DayCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { GOAL_LABELS, EQUIPMENT_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { SavedPlan } from '@/types/workout';
import { Link } from 'react-router-dom';

function PlanCard({ plan, onDelete, isDeleting }: {
  plan: SavedPlan;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-bg-card shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-display font-semibold text-lg truncate">
            {plan.title || plan.ai_response?.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {[
              GOAL_LABELS[plan.goal] ?? plan.goal,
              EQUIPMENT_LABELS[plan.equipment] ?? plan.equipment,
              `${plan.days_per_week} days/week`,
              `${plan.duration} min`,
              plan.experience,
            ].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-border text-text-secondary capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-text-secondary text-xs mt-2">{formatDate(plan.created_at)}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Delete */}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-accent-danger">Confirm?</span>
              <button
                onClick={() => { onDelete(plan.id); setConfirmDelete(false); }}
                disabled={isDeleting}
                className="px-2 py-1 rounded-lg bg-accent-danger/10 border border-accent-danger/30 text-accent-danger text-xs hover:bg-accent-danger/20 transition-colors"
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 rounded-lg bg-white/5 border border-border text-text-secondary text-xs hover:bg-white/10 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-lg text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Expand */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
          >
            <ChevronDown className={cn('w-5 h-5 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Expanded plan */}
      <AnimatePresence>
        {expanded && plan.ai_response && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-5 space-y-3">
              {plan.ai_response.summary && (
                <p className="text-text-secondary text-sm leading-relaxed">
                  {plan.ai_response.summary}
                </p>
              )}
              {plan.ai_response.weekly_plan?.map((day, i) => (
                <DayCard key={i} day={day} index={i} defaultOpen={false} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SavedPlans() {
  const { plans, isLoading, isError, deletePlan, isDeleting } = usePlans();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-5 h-5 text-accent-primary" />
          <h1 className="font-display font-bold text-3xl text-text-primary">My Plans</h1>
          <span className="ml-auto px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-medium">
            {plans.length} saved
          </span>
        </div>

        {isError && (
          <div className="mb-6 p-4 rounded-xl bg-accent-danger/10 border border-accent-danger/20 flex items-center gap-2 text-accent-danger text-sm">
            <AlertTriangle className="w-4 h-4" />
            Failed to load plans. Please refresh.
          </div>
        )}

        {plans.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-accent-primary/40" />}
            title="No Saved Plans Yet"
            description="Generate a workout plan and save it to see it here."
            action={
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-white font-semibold text-sm hover:bg-accent-primary/90 transition-colors"
              >
                Generate Your First Plan
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onDelete={(id) => deletePlan(id)}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
