import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'primary' | 'secondary' | 'danger' | 'energy' | 'success';
}

export function StatsCard({ icon, label, value, sub, accent = 'primary' }: StatsCardProps) {
  const accentColors = {
    primary: 'text-accent-primary bg-accent-primary/10 border-accent-primary/20',
    secondary: 'text-accent-secondary bg-accent-secondary/10 border-accent-secondary/20',
    danger: 'text-accent-danger bg-accent-danger/10 border-accent-danger/20',
    energy: 'text-accent-energy bg-accent-energy/10 border-accent-energy/20',
    success: 'text-accent-success bg-accent-success/10 border-accent-success/20',
  };

  const glowShadows = {
    primary: 'hover:shadow-glow-violet',
    secondary: 'hover:shadow-glow-cyan',
    danger: 'hover:border-accent-danger/50',
    energy: 'hover:shadow-glow-orange',
    success: 'hover:border-accent-success/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-xl border border-border bg-bg-card p-5 shadow-card transition-all duration-300 ${glowShadows[accent]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm mb-1">{label}</p>
          <p className="text-text-primary font-display font-bold text-2xl font-stat">{value}</p>
          {sub && <p className="text-text-secondary text-xs mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg border ${accentColors[accent]}`}>{icon}</div>
      </div>
    </motion.div>
  );
}
