import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trash2, ChevronDown, AlertTriangle, Search, ArrowUpDown, Target, Layers, Dumbbell } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { DayCard } from '@/components/planner/DayCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { GOAL_LABELS, EQUIPMENT_LABELS, BODY_FOCUS_LABELS } from '@/lib/constants';
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

  const firstDay = plan.ai_response?.weekly_plan?.[0];

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
            <div className="p-5 space-y-4">
              {/* Rich Summary */}
              <div className="rounded-xl border border-accent-primary/15 bg-accent-primary/[0.04] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary mb-3">Plan Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent-primary" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase">Goal</p>
                      <p className="text-sm font-medium text-text-primary">{GOAL_LABELS[plan.goal] ?? plan.goal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-primary" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase">Split</p>
                      <p className="text-sm font-medium text-text-primary">{BODY_FOCUS_LABELS[plan.body_focus] ?? plan.body_focus}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-accent-primary" />
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase">Focus Area</p>
                      <p className="text-sm font-medium text-text-primary">{firstDay?.focus ?? '—'}</p>
                    </div>
                  </div>
                </div>

                {/* First workout session preview */}
                {firstDay && firstDay.exercises?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <p className="text-xs text-text-secondary mb-2">
                      First session preview — {firstDay.day}: {firstDay.focus}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {firstDay.exercises.slice(0, 4).map((ex, i) => (
                        <span key={i} className="px-2 py-1 rounded-lg text-xs bg-white/5 border border-border text-text-primary">
                          {ex.name}
                        </span>
                      ))}
                      {firstDay.exercises.length > 4 && (
                        <span className="px-2 py-1 rounded-lg text-xs bg-accent-primary/10 text-accent-primary">
                          +{firstDay.exercises.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');

  const filtered = useMemo(() => {
    let result = [...plans];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          (GOAL_LABELS[p.goal] ?? p.goal).toLowerCase().includes(q) ||
          p.ai_response?.summary?.toLowerCase().includes(q)
      );
    }

    // Goal filter
    if (goalFilter !== 'All') {
      result = result.filter((p) => p.goal === goalFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'duration_asc': return a.duration - b.duration;
        case 'duration_desc': return b.duration - a.duration;
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [plans, searchQuery, goalFilter, sortBy]);

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
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-5 h-5 text-accent-primary" />
          <h1 className="font-display font-bold text-3xl text-text-primary">My Plans</h1>
          <span className="ml-auto px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-medium">
            {plans.length} saved
          </span>
        </div>

        {/* Search & Filter Controls */}
        {plans.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plans by name, goal, or description…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white/5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-primary/50"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="rounded-lg border border-border bg-white/5 px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
              >
                <option value="All">All Goals</option>
                {Object.entries(GOAL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5 ml-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-text-secondary" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border bg-white/5 px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
                >
                  <option value="date_desc">Newest first</option>
                  <option value="date_asc">Oldest first</option>
                  <option value="duration_asc">Shortest</option>
                  <option value="duration_desc">Longest</option>
                </select>
              </div>
            </div>
          </div>
        )}

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
        ) : filtered.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-8">No plans match your search or filters.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((plan) => (
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
