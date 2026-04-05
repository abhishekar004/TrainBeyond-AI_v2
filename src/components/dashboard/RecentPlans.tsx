import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { GOAL_LABELS } from '@/lib/constants';
import type { SavedPlan } from '@/types/workout';

interface RecentPlansProps {
  plans: SavedPlan[];
}

export function RecentPlans({ plans }: RecentPlansProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-8 text-center">
        <p className="text-text-secondary text-sm">No plans yet. Generate your first plan!</p>
        <Link
          to="/planner"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary/10 
                     border border-accent-primary/20 text-accent-primary text-sm font-medium hover:bg-accent-primary/20 transition-colors"
        >
          Generate Plan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plans.slice(0, 3).map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center justify-between p-4 rounded-xl border border-border 
                     bg-bg-card hover:border-accent-primary/30 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
              <Calendar className="w-4 h-4 text-accent-primary" />
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium">{plan.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-text-secondary text-xs">
                  {GOAL_LABELS[plan.goal] ?? plan.goal}
                </span>
                <span className="text-text-secondary/40 text-xs">•</span>
                <span className="text-text-secondary text-xs">{formatDate(plan.created_at)}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-accent-primary transition-colors" />
        </motion.div>
      ))}

      {plans.length > 3 && (
        <Link
          to="/plans"
          className="block text-center text-sm text-accent-primary hover:underline mt-2"
        >
          View all {plans.length} plans →
        </Link>
      )}
    </div>
  );
}
