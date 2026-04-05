import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import type { DbUserGamification } from '@/types/db';
import { levelFromXp } from '@/lib/levelSystem';

type Props = { data: DbUserGamification | null; loading?: boolean };

export function HeroLevelXp({ data, loading }: Props) {
  const xp = data?.xp ?? 0;
  const { name, nextMinXp, minXp } = levelFromXp(xp);
  const progress = nextMinXp > minXp ? Math.min(100, ((xp - minXp) / (nextMinXp - minXp)) * 100) : 100;

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card p-8 h-48 animate-pulse" />
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-card via-bg-card to-accent-primary/10 p-8 shadow-card"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">Your level</p>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent-primary/15 border border-accent-primary/25">
              <Trophy className="w-8 h-8 text-accent-primary" />
            </div>
            <div>
              <h1 className="font-display font-black text-4xl text-text-primary leading-none">{name}</h1>
              <p className="text-text-secondary text-sm mt-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-accent-secondary" />
                {xp.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full bg-gradient-violet"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Next tier at {nextMinXp.toLocaleString()} XP
          </p>
        </div>
      </div>
    </motion.section>
  );
}
