import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface WelcomeBannerProps {
  user: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const name = user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'Athlete';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-accent-primary/20 
                 bg-gradient-to-br from-accent-primary/10 via-bg-card to-accent-secondary/5 p-6 shadow-card"
    >
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent-primary/10 blur-2xl pointer-events-none" />

      <div className="relative">
        <p className="text-text-secondary text-sm mb-1">{greeting},</p>
        <h1 className="text-text-primary font-display font-bold text-3xl mb-2">
          {name} 💪
        </h1>
        <p className="text-text-secondary text-sm mb-5 max-w-md">
          Ready to crush today's workout? Generate a personalized plan and start training smarter.
        </p>
        <Link
          to="/planner"
          id="dashboard-generate-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
                     bg-accent-primary text-white font-semibold text-sm
                     hover:bg-accent-primary/90 transition-all shadow-glow-violet"
        >
          <Sparkles className="w-4 h-4" />
          Generate New Plan
        </Link>
      </div>
    </motion.div>
  );
}
