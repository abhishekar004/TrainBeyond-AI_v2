import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="font-display font-black text-[8rem] text-accent-primary/20 leading-none mb-4">
          404
        </div>
        <h1 className="font-display font-bold text-3xl text-text-primary mb-3">Page Not Found</h1>
        <p className="text-text-secondary text-lg mb-8">
          Looks like this page skipped leg day. It doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-white 
                     font-semibold hover:bg-accent-primary/90 transition-all shadow-glow-violet"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
