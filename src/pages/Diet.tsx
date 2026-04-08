import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchProfileExtended, updateBiometrics } from '@/services/profile.service';
import {
  bmrMifflin,
  tdeeFromBmr,
  macrosFromTdee,
  type Activity,
  type Goal,
  type Sex,
} from '@/lib/dietCalculator';
import { INDIAN_MEAL_IDEAS } from '@/data/indianMeals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Bookmark, Shuffle, Sparkles, Coffee, Sun, Cookie, Moon } from 'lucide-react';

const CALORIE_SPLIT = [
  { label: 'Breakfast', percent: 25, icon: Coffee, color: 'bg-violet-500' },
  { label: 'Lunch', percent: 35, icon: Sun, color: 'bg-accent-primary' },
  { label: 'Snack', percent: 15, icon: Cookie, color: 'bg-accent-secondary' },
  { label: 'Dinner', percent: 25, icon: Moon, color: 'bg-blue-500' },
];

export function Diet() {
  const { user } = useAuth();
  const [age, setAge] = useState(28);
  const [sex, setSex] = useState<Sex>('male');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [activity, setActivity] = useState<Activity>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProfileExtended(user.id).then((p) => {
      if (!p) return;
      if (p.age != null) setAge(p.age);
      if (p.sex === 'male' || p.sex === 'female') setSex(p.sex);
      if (p.height_cm != null) setHeightCm(Number(p.height_cm));
      if (p.weight_kg != null) setWeightKg(Number(p.weight_kg));
      if (p.activity_level && ['sedentary', 'light', 'moderate', 'active', 'athlete'].includes(p.activity_level)) {
        setActivity(p.activity_level as Activity);
      }
    });
  }, [user]);

  const bmr = bmrMifflin(weightKg, heightCm, age, sex);
  const tdee = tdeeFromBmr(bmr, activity);
  const macros = macrosFromTdee(tdee, weightKg, goal);

  const persist = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateBiometrics(user.id, {
        height_cm: heightCm,
        weight_kg: weightKg,
        age,
        sex,
        activity_level: activity,
      });
      toast.success('Biometrics saved to your profile');
    } catch {
      toast.error('Could not save — check Supabase profiles columns (run schema-extensions.sql).');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Diet</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Calorie & macro estimator (Mifflin–St Jeor) plus Indian meal inspiration — not medical advice.
          </p>
        </div>

        <Tabs defaultValue="calculator">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="meals">Indian meal ideas</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Biometrics & goal</CardTitle>
                <CardDescription>Adjust values — targets update instantly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="space-y-1 text-sm">
                    <span className="text-text-secondary">Age</span>
                    <input
                      type="number"
                      value={age}
                      min={16}
                      max={90}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-text-secondary">Sex (for BMR formula)</span>
                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value as Sex)}
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-text-secondary">Height (cm)</span>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
                    />
                  </label>
                  <label className="space-y-1 text-sm">
                    <span className="text-text-secondary">Weight (kg)</span>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
                    />
                  </label>
                  <label className="space-y-1 text-sm sm:col-span-2">
                    <span className="text-text-secondary">Activity</span>
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value as Activity)}
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                      <option value="athlete">Athlete</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-sm sm:col-span-2">
                    <span className="text-text-secondary">Goal</span>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value as Goal)}
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-text-primary"
                    >
                      <option value="cut">Fat loss (~−15% kcal)</option>
                      <option value="maintain">Maintain</option>
                      <option value="bulk">Muscle gain (~+10% kcal)</option>
                    </select>
                  </label>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border bg-white/5 p-4">
                    <p className="text-xs text-text-secondary">BMR</p>
                    <p className="font-display text-xl font-bold text-text-primary font-stat">{Math.round(bmr)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white/5 p-4">
                    <p className="text-xs text-text-secondary">TDEE</p>
                    <p className="font-display text-xl font-bold text-accent-primary font-stat">{tdee}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white/5 p-4">
                    <p className="text-xs text-text-secondary">Target kcal</p>
                    <p className="font-display text-xl font-bold text-accent-secondary font-stat">{macros.calories}</p>
                  </div>

                  {/* Enhanced Macros Card */}
                  <div className="rounded-xl border border-accent-primary/25 bg-accent-primary/[0.08] p-4 sm:col-span-2 lg:col-span-1 shadow-glow-violet/20">
                    <p className="text-xs text-text-secondary mb-2">Macros (g)</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-stat">
                        P {macros.proteinG}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/25 font-stat">
                        C {macros.carbsG}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 font-stat">
                        F {macros.fatG}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Suggested Calorie Split */}
                <div className="rounded-xl border border-border bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    Suggested Calorie Split
                  </p>
                  <div className="space-y-2.5">
                    {CALORIE_SPLIT.map((item) => {
                      const kcal = Math.round((macros.calories * item.percent) / 100);
                      return (
                        <div key={item.label} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-text-secondary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-text-primary font-medium">{item.label}</span>
                              <span className="text-text-secondary font-stat">{item.percent}% · {kcal} kcal</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.color} transition-all duration-500`}
                                style={{ width: `${item.percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button type="button" onClick={persist} disabled={saving}>
                  {saving ? 'Saving…' : 'Save to profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="meals">
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button type="button" variant="secondary" size="sm" onClick={() => toast.success('Meal saved! (Demo)')}>
                <Bookmark className="w-3.5 h-3.5" />
                Save Meal
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => toast.info('Shuffled! (Demo)')}>
                <Shuffle className="w-3.5 h-3.5" />
                Shuffle Ideas
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => toast.info('Generating more… (Demo)')}>
                <Sparkles className="w-3.5 h-3.5" />
                Generate More
              </Button>
            </div>

            <div className="grid gap-4">
              {INDIAN_MEAL_IDEAS.map((block) => (
                <Card key={block.title}>
                  <CardHeader>
                    <CardTitle className="text-lg">{block.title}</CardTitle>
                    <CardDescription>Rotate options to match your macro split.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-text-secondary">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
