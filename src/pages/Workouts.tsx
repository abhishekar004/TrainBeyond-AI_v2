import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight, Sparkles, SlidersHorizontal, ArrowUpDown, Bookmark } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import { GOAL_LABELS, EQUIPMENT_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const DURATION_FILTERS = ['All', '20', '30', '45', '60', '90'] as const;
const DIFFICULTY_FILTERS = ['All', 'beginner', 'intermediate', 'advanced'] as const;
const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'duration_asc', label: 'Shortest' },
  { value: 'duration_desc', label: 'Longest' },
] as const;

export function Workouts() {
  const { plans, isLoading } = usePlans();

  const [goalFilter, setGoalFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [equipFilter, setEquipFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...plans];
    if (goalFilter !== 'All') result = result.filter((p) => p.goal === goalFilter);
    if (durationFilter !== 'All') result = result.filter((p) => String(p.duration) === durationFilter);
    if (difficultyFilter !== 'All') result = result.filter((p) => p.experience === difficultyFilter);
    if (equipFilter !== 'All') result = result.filter((p) => p.equipment === equipFilter);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'duration_asc': return a.duration - b.duration;
        case 'duration_desc': return b.duration - a.duration;
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return result;
  }, [plans, goalFilter, durationFilter, difficultyFilter, equipFilter, sortBy]);

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-sm font-medium">
              <Bookmark className="w-3.5 h-3.5" />
              Saved plans: {plans.length}
            </span>
            <Button asChild>
              <Link to="/planner">
                <Sparkles className="w-4 h-4" />
                New AI plan
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className={showFilters ? 'border-accent-primary/50 text-accent-primary' : ''}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </Button>
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-border bg-white/5 px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary/50"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-border bg-bg-card p-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="text-xs text-text-secondary">
                Goal
                <select value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-2 py-1.5 text-sm text-text-primary">
                  <option value="All">All Goals</option>
                  {Object.entries(GOAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label className="text-xs text-text-secondary">
                Duration
                <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-2 py-1.5 text-sm text-text-primary">
                  {DURATION_FILTERS.map((d) => <option key={d} value={d}>{d === 'All' ? 'All' : `${d} min`}</option>)}
                </select>
              </label>
              <label className="text-xs text-text-secondary">
                Difficulty
                <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-2 py-1.5 text-sm text-text-primary">
                  {DIFFICULTY_FILTERS.map((d) => <option key={d} value={d}>{d === 'All' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </label>
              <label className="text-xs text-text-secondary">
                Equipment
                <select value={equipFilter} onChange={(e) => setEquipFilter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-white/5 px-2 py-1.5 text-sm text-text-primary">
                  <option value="All">All Equipment</option>
                  {Object.entries(EQUIPMENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
            </div>
          </motion.div>
        )}

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

        {!isLoading && plans.length > 0 && filtered.length === 0 && (
          <p className="text-text-secondary text-sm text-center py-8">No plans match the current filters.</p>
        )}

        <div className="grid gap-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to="/plans" className="block group">
                <Card className="border-border hover:border-accent-primary/50 hover:shadow-glow-violet transition-all duration-300">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display font-extrabold text-lg text-text-primary group-hover:text-accent-primary transition-colors">
                        {p.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {[
                          GOAL_LABELS[p.goal] ?? p.goal,
                          `${p.days_per_week}×/wk`,
                          `${p.duration} min`,
                          formatDate(p.created_at),
                        ].map((chip) => (
                          <span
                            key={chip}
                            className="px-2 py-0.5 rounded-full text-xs bg-white/[0.07] border border-border text-text-primary/70 font-medium"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
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
