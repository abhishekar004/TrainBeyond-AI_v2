import { motion } from 'framer-motion';
import { Sparkles, Zap, Swords, Cpu, Leaf } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-bg-primary py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-4xl text-text-primary mb-4">About TrainBeyond AI</h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            TrainBeyond AI helps you train with clarity — not confusion. We combine structured fitness principles with adaptive AI so your workouts stay personal, practical, and built for real progress.
          </p>
          
          <div className="mt-10 relative overflow-hidden rounded-xl border-l-4 border-accent-primary bg-gradient-to-r from-accent-primary/10 to-transparent p-6 sm:p-8">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary shadow-[0_0_20px_rgba(108,99,255,0.8)]" />
            <p className="font-display font-bold text-2xl italic bg-gradient-violet bg-clip-text text-transparent">
              "Train with Purpose. Powered by AI. Inspired by You."
            </p>
          </div>
        </motion.div>

        <section className="rounded-2xl border border-border bg-bg-card/80 p-6 space-y-4">
          <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-xl">
            <Sparkles className="w-5 h-5 text-blue-400" />
            The Story Behind Our Name
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Our name draws inspiration from iconic moments in anime and the limitless potential of human evolution:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-5 rounded-xl border border-white/5 bg-bg-primary hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/15 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="font-semibold text-text-primary mb-1">Plus Ultra Spirit</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Push beyond what you think is possible.
              </p>
            </div>
            
            <div className="p-5 rounded-xl border border-white/5 bg-bg-primary hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center mb-4">
                <Swords className="w-5 h-5 text-blue-400" />
              </div>
              <p className="font-semibold text-text-primary mb-1">Surpass Your Limits</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Growth lives outside the comfort zone.
              </p>
            </div>
            
            <div className="p-5 rounded-xl border border-white/5 bg-bg-primary hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5 text-violet-400" />
              </div>
              <p className="font-semibold text-text-primary mb-1">AI-Powered Evolution</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Technology that adapts with you.
              </p>
            </div>
            
            <div className="p-5 rounded-xl border border-white/5 bg-bg-primary hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="font-semibold text-text-primary mb-1">Beyond Limitations</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                No ceiling on what you can achieve.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-bg-card/80 p-6 space-y-4">
          <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-xl">
            <Cpu className="w-5 h-5 text-purple-400" />
            Why We Built This
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            Most fitness apps either overwhelm you with generic templates or leave you guessing what to do next. TrainBeyond AI was built to make training simpler, smarter, and more personal — whether you're lifting, cutting, or learning calisthenics.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-bg-card/80 p-6 space-y-3">
          <div className="flex items-center gap-2 text-text-primary font-display font-semibold text-xl">
            <Sparkles className="w-5 h-5 text-blue-400" />
            What Makes Us Special
          </div>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-2">
            <li>Plans grounded in your profile: goals, schedule, equipment, and experience.</li>
            <li>Progress and gamification that reward consistency without shame on rest days.</li>
            <li>OpenRouter-backed coach with sensible fallbacks when the network hiccups.</li>
            <li>Supabase-backed history so your data stays yours — resume anywhere.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
