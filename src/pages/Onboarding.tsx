import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useGamification } from '@/hooks/useGamification';
import { motion } from 'framer-motion';
import { Dumbbell, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { completeOnboarding } from '@/services/gamification.service';
import { saveFullProfile } from '@/services/profile.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DbUserGamification } from '@/types/db';

const goals = ['Lose fat', 'Build muscle', 'Get stronger', 'General fitness', 'Calisthenics skills'];

export function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { gamification, isLoading: gLoading } = useGamification();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (gLoading) return;
    if (gamification?.onboarding_completed) {
      navigate('/home', { replace: true });
    }
  }, [gLoading, gamification, navigate]);

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (selectedGoals.length > 0) {
        try {
          await saveFullProfile(user.id, { fitness_goal: selectedGoals.join(', ') });
          await qc.invalidateQueries({ queryKey: ['profile', user.id] });
        } catch (goalErr) {
          console.warn('[onboarding] save goals skipped:', goalErr);
          toast.warning(
            'Goals were not saved (database may need updating). Run supabase/RUN_IN_SUPABASE.sql — you can add goals later in Profile.'
          );
        }
      }

      await completeOnboarding(user.id);

      qc.setQueryData<DbUserGamification>(['gamification', user.id], (prev) =>
        prev ? { ...prev, onboarding_completed: true } : prev
      );
      await qc.invalidateQueries({ queryKey: ['gamification', user.id] });
      await qc.refetchQueries({ queryKey: ['gamification', user.id] });

      toast.success("You're all set!");
      navigate('/home', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : 'Could not finish onboarding. Check Supabase migrations and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-accent-primary/5 blur-3xl pointer-events-none" />
      <Card className="relative w-full max-w-lg border-accent-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-gradient-violet">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-text-secondary font-medium">Step {step + 1} of 3</span>
          </div>
          <CardTitle className="font-display text-2xl">
            {step === 0 && 'Welcome to TrainBeyond'}
            {step === 1 && 'What are you chasing?'}
            {step === 2 && 'Ready to train smarter'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-text-secondary text-sm leading-relaxed">
              <p>
                You&apos;ll get an app home with XP & levels, an AI coach, diet calculator with Indian meal ideas,
                a weekly schedule, and progress charts — all tied to your Supabase account.
              </p>
              <Button type="button" className="w-full" onClick={() => setStep(1)}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-text-secondary">Pick any that apply (helps us tune insights).</p>
              <div className="flex flex-wrap gap-2">
                {goals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedGoals.includes(g)
                        ? 'border-accent-primary bg-accent-primary/15 text-accent-primary'
                        : 'border-border bg-white/5 text-text-secondary hover:border-accent-primary/30'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button type="button" className="flex-1" onClick={() => setStep(2)}>
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-text-secondary">
                We&apos;ll drop you on <strong className="text-text-primary">Home</strong> where you can open the planner,
                coach, and schedule.
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" className="flex-1" disabled={saving} onClick={finish}>
                  {saving ? 'Saving…' : (
                    <>
                      <Check className="w-4 h-4" />
                      Enter app
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
