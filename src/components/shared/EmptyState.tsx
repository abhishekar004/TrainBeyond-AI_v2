import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center"
    >
      {icon && (
        <div className="p-5 rounded-2xl bg-accent-primary/5 border border-accent-primary/10">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-display font-semibold text-text-primary mb-1">{title}</h3>
        {description && (
          <p className="text-text-secondary text-sm max-w-sm">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
