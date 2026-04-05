import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight, Sparkles } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { GOAL_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Workouts() {
  const { plans, isLoading } = usePlans();

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-accent-primary" />
              Workouts
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              AI-generated structured plans live in Supabase — open full detail from Saved Plans or regenerate anytime.
            </p>
          </div>
          <Button asChild>
            <Link to="/planner">
              <Sparkles className="w-4 h-4" />
              New AI plan
            </Link>
          </Button>
        </div>

        {isLoading && <p className="text-text-secondary text-sm">Loading…</p>}

        {!isLoading && plans.length === 0 && (
          <Card className="border-dashed border-accent-primary/40">
            <CardHeader>
              <CardTitle>No workouts yet</CardTitle>
              <CardDescription>Generate a plan — it saves to your account automatically after you click Save.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary">
                <Link to="/planner">Open planner</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to="/plans" className="block group">
                <Card className="border-border hover:border-accent-primary/40 transition-all">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display font-bold text-lg text-text-primary group-hover:text-accent-primary transition-colors">
                        {p.title}
                      </h2>
                      <p className="text-sm text-text-secondary mt-1">
                        {GOAL_LABELS[p.goal] ?? p.goal} · {p.days_per_week}×/wk · {p.duration} min ·{' '}
                        {formatDate(p.created_at)}
                      </p>
                      <p className="text-xs text-text-secondary/80 mt-2 line-clamp-2">
                        {p.ai_response?.summary ?? ''}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent-primary shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-text-secondary">
          <Link to="/plans" className="text-accent-primary hover:underline">
            Open full library &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
