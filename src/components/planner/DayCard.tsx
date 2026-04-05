import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Flame, Snowflake, Dumbbell } from 'lucide-react';
import { ExerciseTable } from './ExerciseTable';
import type { WorkoutDay } from '@/types/workout';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: WorkoutDay;
  index: number;
  defaultOpen?: boolean;
}

export function DayCard({ day, index, defaultOpen = false }: DayCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border border-border bg-bg-card hover:border-accent-primary/30 transition-all shadow-card"
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
            <span className="text-accent-primary font-display font-bold text-sm">
              {index + 1}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-xs font-medium uppercase tracking-wide">
                {day.day}
              </span>
            </div>
            <h3 className="text-text-primary font-semibold">{day.focus}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-text-secondary text-xs">
            <Dumbbell className="w-3 h-3" />
            {day.exercises.length} exercises
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-text-secondary transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border">
              {/* Warmup */}
              {day.warmup.length > 0 && (
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">
                      Warm-Up
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {day.warmup.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                        <span className="text-orange-400/60 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exercises */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Dumbbell className="w-4 h-4 text-accent-primary" />
                  <span className="text-accent-primary text-xs font-semibold uppercase tracking-wide">
                    Workout
                  </span>
                </div>
                <ExerciseTable exercises={day.exercises} />
              </div>

              {/* Cooldown */}
              {day.cooldown.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Snowflake className="w-4 h-4 text-accent-secondary" />
                    <span className="text-accent-secondary text-xs font-semibold uppercase tracking-wide">
                      Cool-Down
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {day.cooldown.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                        <span className="text-accent-secondary/60 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
