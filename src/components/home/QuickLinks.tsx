import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, UtensilsCrossed, CalendarDays, TrendingUp, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/coach', label: 'AI Coach', desc: 'Chat & quick prompts', icon: MessageCircle },
  { href: '/diet', label: 'Diet', desc: 'Macros & meal ideas', icon: UtensilsCrossed },
  { href: '/schedule', label: 'Schedule', desc: 'Weekly completions', icon: CalendarDays },
  { href: '/progress', label: 'Progress', desc: 'Charts & trends', icon: TrendingUp },
  { href: '/workouts', label: 'Workouts', desc: 'Saved AI plans', icon: Dumbbell },
] as const;

export function QuickLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {links.map((item, i) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            to={item.href}
            className={cn(
              'flex items-start gap-4 p-4 rounded-2xl border border-border bg-bg-card',
              'hover:border-accent-primary/40 hover:bg-accent-primary/5 transition-all group'
            )}
          >
            <div className="p-2.5 rounded-xl bg-white/5 border border-border group-hover:border-accent-primary/30">
              <item.icon className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-text-primary">{item.label}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
