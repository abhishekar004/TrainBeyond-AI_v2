import { motion } from 'framer-motion';

export function PlanSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-white/5 rounded-lg w-2/3" />
      <div className="h-4 bg-white/5 rounded-lg w-full" />
      <div className="h-4 bg-white/5 rounded-lg w-5/6" />

      {/* Day cards skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-bg-card p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-white/5 rounded-md" />
            <div className="h-5 w-32 bg-white/5 rounded-md" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-10 bg-white/5 rounded-md" />
            ))}
          </div>
        </motion.div>
      ))}

      <div className="flex gap-3 mt-6">
        <div className="h-11 flex-1 bg-accent-primary/20 rounded-xl" />
        <div className="h-11 flex-1 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
