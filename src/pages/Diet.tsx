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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-border bg-white/5 p-4">
                    <p className="text-xs text-text-secondary">BMR</p>
                    <p className="font-display text-xl font-bold text-text-primary">{Math.round(bmr)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white/5 p-4">
                    <p className="text-xs text-text-secondary">TDEE</p>
                    <p className="font-display text-xl font-bold text-accent-primary">{tdee}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-white/5 p-4">
                    <p className="text-xs text-text-secondary">Target kcal</p>
                    <p className="font-display text-xl font-bold text-accent-secondary">{macros.calories}</p>
                  </div>
                  <div className="rounded-xl border border-accent-primary/20 bg-accent-primary/5 p-4 sm:col-span-2 lg:col-span-1">
                    <p className="text-xs text-text-secondary">Macros (g)</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">
                      P {macros.proteinG} · C {macros.carbsG} · F {macros.fatG}
                    </p>
                  </div>
                </div>

                <Button type="button" onClick={persist} disabled={saving}>
                  {saving ? 'Saving…' : 'Save to profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="meals">
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
