import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Sparkles, Brain, Shield, ArrowRight, CheckCircle, Zap, Target, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Brain,
    title: 'Adaptive AI Coaching',
    desc: 'Advanced AI analyzes your goals, experience, and equipment to craft the perfect workout blueprint.',
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10 border-accent-primary/20',
  },
  {
    icon: Shield,
    title: 'Injury-Smart Programming',
    desc: "Tell us your limitations and the AI designs every session around your body's needs.",
    color: 'text-accent-secondary',
    bg: 'bg-accent-secondary/10 border-accent-secondary/20',
  },
  {
    icon: Target,
    title: 'Goal-Based Training Paths',
    desc: 'From fat loss to calisthenics mastery — every training goal gets a specialized methodology.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    icon: Zap,
    title: 'Instant Weekly Plans',
    desc: 'Full weekly plan with warmup, exercises, sets, reps, and cooldowns in seconds.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/20',
  },
];

const steps = [
  { num: '01', title: 'Fill Your Profile', desc: 'Tell us your goals, training level, equipment, and limitations.' },
  { num: '02', title: 'AI Generates Your Plan', desc: 'Our AI builds a structured weekly training plan tailored to your body and objective.' },
  { num: '03', title: 'Train Smart', desc: 'Train with your personalized plan, track progress, and regenerate anytime.' },
];

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-bg-primary">
      {user && (
        <div className="sticky top-16 z-40 border-b border-accent-primary/20 bg-accent-primary/10 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-text-primary font-medium">You&apos;re signed in</span>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary text-white font-semibold hover:opacity-90"
            >
              <LayoutDashboard className="w-4 h-4" />
              Open app home
            </Link>
          </div>
        </div>
      )}
      <section className="relative overflow-hidden pt-20 pb-24 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-accent-secondary/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-primary/30 
                       bg-accent-primary/10 text-accent-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Fitness Planning
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-text-primary leading-none mb-6"
          >
            Train{' '}
            <span className="bg-gradient-violet bg-clip-text text-transparent">Beyond</span>{' '}
            Your Limits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Your AI fitness coach for smarter workouts, better progress, and plans that actually fit your life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link
                to="/home"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-violet text-white 
                           font-display font-bold text-lg hover:opacity-90 transition-all shadow-glow-violet"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to app
              </Link>
            ) : (
              <Link
                to="/auth?mode=signup"
                id="hero-cta-btn"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-violet text-white 
                           font-display font-bold text-lg hover:opacity-90 transition-all shadow-glow-violet"
              >
                <Sparkles className="w-5 h-5" />
                Start Training Free
              </Link>
            )}
            <Link
              to={user ? '/home' : '/auth'}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border 
                         text-text-secondary font-semibold text-base hover:border-accent-primary/40 
                         hover:text-text-primary transition-all"
            >
              {user ? 'Home' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            {[
              { icon: '🤖', label: 'AI Personalized' },
              { icon: '🌱', label: 'Beginner Friendly' },
              { icon: '🩹', label: 'Injury Aware' },
              { icon: '🎯', label: 'Goal Based' }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-bg-card/50 text-text-secondary text-sm font-medium shadow-sm">
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            className="max-w-md mx-auto mt-16 relative text-left group"
          >
            <div className="absolute -inset-1 bg-gradient-violet rounded-[2rem] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative z-10 w-full bg-bg-card rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <span className="font-display font-bold text-lg md:text-xl text-text-primary">Monday — Push Strength</span>
                <span className="text-xs px-2.5 py-1 bg-accent-primary/10 text-accent-primary rounded-lg font-semibold border border-accent-primary/20">AI Generated</span>
              </div>
              <ul className="space-y-4 mb-5">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary mt-2 shrink-0 shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                  <span className="text-text-secondary"><strong className="text-text-primary font-semibold">Incline Push-ups</strong> — 4×12</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary mt-2 shrink-0 shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                  <span className="text-text-secondary"><strong className="text-text-primary font-semibold">Pike Push-ups</strong> — 3×10</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary mt-2 shrink-0 shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                  <span className="text-text-secondary"><strong className="text-text-primary font-semibold">Dips</strong> — 3×8</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary mt-2 shrink-0 shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                  <span className="text-text-secondary"><strong className="text-text-primary font-semibold">Core Finisher</strong> — 8 min</span>
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/10 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary rounded-l-xl" />
                <p className="text-sm text-text-secondary leading-relaxed">
                  <strong className="text-accent-primary">AI Note:</strong> Focus on controlled tempo and shoulder stability this session. If dips hurt, swap to bench dips.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 bg-bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-text-primary mb-4">How It Works</h2>
            <p className="text-text-secondary text-lg">Three steps to your personalized training program</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-px bg-gradient-to-r from-accent-primary/0 via-accent-primary/30 to-accent-primary/0 pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center p-8 rounded-2xl border border-border bg-bg-card hover:border-accent-primary/30 hover:shadow-glow-violet transition-all duration-300"
                >
                  <div className="text-6xl font-display font-black text-accent-primary/20 mb-4 inline-block relative">
                    {step.num}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                  </div>
                  <h3 className="text-text-primary font-display font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-text-secondary text-base leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 bg-bg-primary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-text-secondary text-lg">Built for serious athletes, accessible to everyone</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-2xl border border-border bg-bg-card hover:-translate-y-1 hover:border-accent-primary/40 hover:shadow-[0_8px_30px_rgba(108,99,255,0.15)] transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
                <div className={`inline-flex p-3 rounded-xl border mb-5 transition-transform duration-300 group-hover:scale-110 ${feat.bg}`}>
                  <feat.icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-text-primary font-display font-bold text-xl mb-3">{feat.title}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-text-primary mb-4">Built for Real Goals</h2>
            <p className="text-text-secondary text-lg">Your path dictates the programming, not the other way around.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔥', title: 'Fat Loss', desc: 'Sustainable calorie burn combined with progressive overload to maintain muscle while cutting.' },
              { icon: '💪', title: 'Muscle Gain', desc: 'Structured hypertrophy blocks prioritizing mechanical tension and optimal recovery cycles.' },
              { icon: '⚡', title: 'Calisthenics', desc: 'Skill-based strength progressions, from perfect pull-ups to front lever supremacy.' }
            ].map((goal, i) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-border bg-bg-card flex flex-col text-center items-center hover:border-white/10 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-5">{goal.icon}</div>
                <h3 className="font-display font-bold text-xl text-text-primary mb-3">{goal.title}</h3>
                <p className="text-text-secondary leading-relaxed">{goal.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-bg-primary relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-text-primary mb-4">TrainBeyond vs Generic Apps</h2>
            <p className="text-text-secondary text-lg">Why static templates fail and adaptive AI wins.</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-bg-card/80 overflow-hidden shadow-xl backdrop-blur-sm"
          >
            <div className="grid grid-cols-2 border-b border-border bg-black/20">
              <div className="p-6 text-center font-bold text-text-secondary">Generic Fitness Apps</div>
              <div className="p-6 text-center font-bold text-text-primary bg-accent-primary/10 border-l border-accent-primary/20">TrainBeyond AI</div>
            </div>
            
            {[
              { generic: 'One-size-fits-all', trainbeyond: 'Fully personalized to you' },
              { generic: 'Hard to stay consistent', trainbeyond: 'Structured, gamified progression' },
              { generic: 'Ignores injuries & limitations', trainbeyond: 'Adapts safely to limitations' },
              { generic: 'No context awareness', trainbeyond: 'Goal-aware AI logic' }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors">
                <div className="p-5 text-center text-text-secondary text-sm md:text-base border-r border-border/50">{row.generic}</div>
                <div className="p-5 text-center text-text-primary font-medium text-sm md:text-base bg-accent-primary/5">{row.trainbeyond}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-white/10 bg-bg-card p-10 sm:p-14 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-primary/20 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="p-4 rounded-2xl bg-gradient-violet shadow-[0_0_30px_rgba(108,99,255,0.4)]">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-text-primary mb-6 leading-tight">
                Stop Guessing. <br className="hidden sm:block"/>Start Training With Structure.
              </h2>
              <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
                Create your personalized AI workout plan in under a minute and start making real progress today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                {['Free to start', 'No credit card', 'Cancel anytime'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-text-secondary text-sm font-medium bg-black/20 dark:bg-white/5 py-1.5 px-3 rounded-lg border border-border">
                    <CheckCircle className="w-4 h-4 text-accent-secondary" />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                to={user ? '/home' : '/auth?mode=signup'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-violet 
                           text-white font-display font-bold text-lg hover:opacity-90 hover:scale-105 transition-all 
                           shadow-glow-violet"
              >
                <Sparkles className="w-5 h-5" />
                {user ? 'Open app' : 'Get Started Free'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
