import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Camera,
  Save,
  Loader2,
  Dumbbell,
  ChevronRight,
  ClipboardList,
  ChevronDown,
  Edit3,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut, syncAuthDisplayName } from '@/services/auth.service';
import { saveFullProfile, uploadAvatarFile } from '@/services/profile.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePlans } from '@/hooks/usePlans';
import { useProfile } from '@/hooks/useProfile';
import { useGamification } from '@/hooks/useGamification';
import { computeBmi } from '@/lib/bmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BmiGauge } from '@/components/profile/BmiGauge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';
import { ImageCropperModal } from '@/components/profile/ImageCropperModal';

const GOAL_OPTIONS = [
  'Lose fat',
  'Build muscle',
  'Get stronger',
  'General fitness',
  'Calisthenics skills',
];

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Lightly Active' },
  { value: 'moderate', label: 'Moderately Active' },
  { value: 'active', label: 'Active' },
  { value: 'athlete', label: 'Athlete' },
] as const;

const ACTIVITY_DISPLAY: Record<string, string> = Object.fromEntries(
  ACTIVITY_OPTIONS.map((o) => [o.value, o.label])
) as Record<string, string>;

const EQUIPMENT_OPTIONS = [
  { value: 'none', label: 'No Equipment (Bodyweight)' },
  { value: 'home', label: 'Home Equipment' },
  { value: 'gym', label: 'Full Gym Access' },
] as const;

const EQUIPMENT_LABELS: Record<string, string> = {
  none: 'No Equipment (Bodyweight)',
  home: 'Home Equipment',
  gym: 'Full Gym Access',
};

function formatDifficulty(s: string): string {
  if (!s) return '—';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Profile() {
  const { user } = useAuth();
  const { plans } = usePlans();
  const { profile, isLoading: profileLoading, refresh } = useProfile();
  const { gamification } = useGamification();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female' | ''>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [fitnessGoals, setFitnessGoals] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>('beginner');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [equipmentPreference, setEquipmentPreference] = useState<string>('none');
  const [weeklyWorkoutDays, setWeeklyWorkoutDays] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activityTab, setActivityTab] = useState('metrics');
  const [trainingOpen, setTrainingOpen] = useState(true);
  const [bodyOpen, setBodyOpen] = useState(true);
  const [bioOpen, setBioOpen] = useState(true);
  const isEditMode = activityTab === 'metrics';
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);


  useEffect(() => {
    if (!profile) return;
    setName(profile.full_name ?? user?.user_metadata?.full_name ?? '');
    setAge(profile.age != null ? String(profile.age) : '');
    setHeightCm(profile.height_cm != null ? String(profile.height_cm) : '');
    setWeightKg(profile.weight_kg != null ? String(profile.weight_kg) : '');
    setSex(profile.sex === 'male' || profile.sex === 'female' ? profile.sex : '');
    setActivityLevel(profile.activity_level || 'moderate');
    setDifficulty(profile.difficulty_level || 'beginner');
    setBio(profile.bio ?? '');
    setAvatarUrl(profile.avatar_url ?? '');
    const g = profile.fitness_goal
      ? profile.fitness_goal.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    setFitnessGoals(g);
    const eq = profile.equipment_preference;
    setEquipmentPreference(eq === 'home' || eq === 'gym' || eq === 'none' ? eq : 'none');
    setWeeklyWorkoutDays(
      profile.weekly_workout_days != null && profile.weekly_workout_days > 0
        ? String(profile.weekly_workout_days)
        : ''
    );
  }, [profile, user]);

  const bmi = useMemo(() => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!h || !w) return 0;
    return computeBmi(w, h);
  }, [heightCm, weightKg]);

  const chartData = useMemo(() => {
    const hist = profile?.bmi_history ?? [];
    if (hist.length > 0) {
      return hist.map((p) => ({
        label: format(new Date(p.at), 'MMM d'),
        bmi: p.bmi,
      }));
    }
    if (bmi > 0) return [{ label: 'Current', bmi }];
    return [];
  }, [profile?.bmi_history, bmi]);

  const toggleGoal = (g: string) => {
    setFitnessGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset so same file can be selected again
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user) return;
    setCropImageSrc(null);
    setUploading(true);
    try {
      const file = new File([croppedBlob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const url = await uploadAvatarFile(user.id, file);
      setAvatarUrl(url);
      
      // Auto-save the avatar URL immediately so it persists on reload
      await saveFullProfile(user.id, {
        avatar_url: url
      });
      await refresh();
      
      toast.success('Photo uploaded and profile updated!');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Check if bucket exists and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const wk = weeklyWorkoutDays.trim() ? parseInt(weeklyWorkoutDays, 10) : null;
      await saveFullProfile(user.id, {
        full_name: name.trim() || null,
        age: age ? parseInt(age, 10) : null,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        sex: sex || null,
        activity_level: activityLevel || null,
        fitness_goal: fitnessGoals.length > 0 ? fitnessGoals.join(', ') : null,
        difficulty_level: difficulty || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        equipment_preference: equipmentPreference || null,
        weekly_workout_days: wk != null && !Number.isNaN(wk) && wk > 0 ? wk : null,
      });
      if (name.trim()) {
        try {
          await syncAuthDisplayName(name.trim());
        } catch {
          /* non-fatal */
        }
      }
      await refresh();
      toast.success('Profile saved');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const scrollToEdit = () => {
    setActivityTab('metrics');
    window.requestAnimationFrame(() => {
      editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  if (!user) return null;

  const initials = (name || user.email || 'U')
    .split(' ')
    .filter(Boolean)
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (profileLoading && !profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const mainGoalDisplay = fitnessGoals[0] || profile?.fitness_goal?.split(',')[0]?.trim() || '—';
  const equipmentDisplay =
    EQUIPMENT_LABELS[equipmentPreference] ||
    (plans[0]?.equipment ? EQUIPMENT_LABELS[plans[0].equipment] || plans[0].equipment : '—');
  const activityDisplay = ACTIVITY_DISPLAY[activityLevel] || activityLevel || '—';
  const weeklyDisplay =
    weeklyWorkoutDays.trim() ||
    (plans[0]?.days_per_week != null ? String(plans[0].days_per_week) : '—');

  const metaLine = [
    `Fitness Level: ${formatDifficulty(difficulty)}`,
    age ? `Age: ${age} years` : null,
    heightCm ? `${heightCm} cm` : null,
    weightKg ? `${weightKg} kg` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-accent-primary" />
          <h1 className="font-display font-bold text-3xl text-text-primary">Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-24 space-y-4"
          >
            <Card className="border-border overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent-primary/30 bg-white/5 flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-3xl text-accent-primary">{initials}</span>
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-accent-primary text-white shadow-glow-violet hover:opacity-90 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="font-display font-bold text-xl text-text-primary break-all">
                    {name || user.email?.split('@')[0] || 'Athlete'}
                  </p>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">{metaLine || 'Complete your profile'}</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since{' '}
                  {user.created_at ? formatDate(user.created_at) : '—'}
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white/5 py-3">
                  <Dumbbell className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm text-text-primary font-medium">Workouts: {plans.length}</span>
                </div>

                <Button type="button" variant="secondary" className="w-full" onClick={scrollToEdit}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-border bg-bg-card p-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-text-secondary shrink-0" />
                <div className="min-w-0">
                  <p className="text-text-secondary text-xs">Email</p>
                  <p className="text-text-primary truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="space-y-6 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-semibold text-xl text-text-primary">Your Activity</h2>
                <p className="text-sm text-text-secondary">Track your workouts and progress.</p>
              </div>
              {isEditMode && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 border border-accent-primary/20 text-accent-primary">
                  <Edit3 className="w-3 h-3" />
                  Editing
                </span>
              )}
            </div>

            <Tabs value={activityTab} onValueChange={setActivityTab} className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 p-1 w-full justify-start sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm rounded-xl">
                <TabsTrigger value="workouts" className="text-xs sm:text-sm">
                  Your Workouts
                </TabsTrigger>
                <TabsTrigger value="progress" className="text-xs sm:text-sm">
                  Progress
                </TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs sm:text-sm">
                  Body Metrics &amp; BMI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workouts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Saved plans</CardTitle>
                    <CardDescription>Plans you have generated and stored.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {plans.length === 0 ? (
                      <p className="text-sm text-text-secondary">No workouts yet — generate a plan from the planner.</p>
                    ) : (
                      plans.slice(0, 8).map((p) => (
                        <Link
                          key={p.id}
                          to="/plans"
                          className="flex items-center justify-between gap-2 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-sm hover:border-accent-primary/30 transition-colors"
                        >
                          <span className="font-medium text-text-primary truncate">{p.title}</span>
                          <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
                        </Link>
                      ))
                    )}
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to="/planner">Open AI Planner</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gamification</CardTitle>
                    <CardDescription>XP, streaks, and levels from your activity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border bg-white/5 p-3">
                        <p className="text-xs text-text-secondary">Level</p>
                        <p className="font-display text-2xl font-bold text-text-primary">{gamification?.level ?? '—'}</p>
                        <p className="text-xs text-text-secondary truncate">{gamification?.level_name}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-white/5 p-3">
                        <p className="text-xs text-text-secondary">XP</p>
                        <p className="font-display text-2xl font-bold text-text-primary">{gamification?.xp ?? '—'}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-white/5 p-3">
                        <p className="text-xs text-text-secondary">Streak</p>
                        <p className="font-display text-2xl font-bold text-text-primary">
                          {gamification?.current_streak ?? '—'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-white/5 p-3">
                        <p className="text-xs text-text-secondary">Best streak</p>
                        <p className="font-display text-2xl font-bold text-text-primary">
                          {gamification?.longest_streak ?? '—'}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" asChild>
                      <Link to="/progress">
                        View full progress
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle>Fitness Profile</CardTitle>
                      <CardDescription>How we personalize coaching and plans.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/onboarding">
                        <ClipboardList className="w-4 h-4" />
                        Retake Questionnaire
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      {[
                        { k: 'Main Goal', v: mainGoalDisplay },
                        { k: 'Equipment', v: equipmentDisplay },
                        { k: 'Activity Level', v: activityDisplay },
                        { k: 'Weekly Goal', v: weeklyDisplay === '—' ? '—' : `${weeklyDisplay} days` },
                      ].map((box) => (
                        <div
                          key={box.k}
                          className="rounded-xl border border-border bg-white/5 px-3 py-3 text-sm"
                        >
                          <p className="text-xs text-text-secondary mb-1">{box.k}</p>
                          <p className="font-medium text-text-primary">{box.v}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    <BmiGauge bmi={bmi} />

                    {chartData.length > 0 && (
                      <div className="rounded-2xl border border-border bg-white/5 p-4">
                        <p className="text-xs text-text-secondary mb-2">History</p>
                        <div className="w-full min-w-0 h-28">
                          <ResponsiveContainer width="100%" height={112} minWidth={0}>
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="bmiFillProfile" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity={0.35} />
                                  <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
                              <Tooltip
                                contentStyle={{
                                  background: 'var(--color-bg-card)',
                                  border: '1px solid var(--color-border)',
                                  borderRadius: 10,
                                  fontSize: 12,
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="bmi"
                                stroke="var(--color-accent-primary)"
                                fill="url(#bmiFillProfile)"
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card ref={editRef}>
                  <CardHeader>
                    <CardTitle>Photo &amp; name</CardTitle>
                    <CardDescription>
                      Avatar uses Supabase Storage bucket <code className="text-xs">avatars</code> or a public URL.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="text-xs text-text-secondary block">
                      Display name
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="text-xs text-text-secondary block">
                      Avatar URL (optional)
                      <input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        placeholder="https://…"
                      />
                    </label>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="cursor-pointer" onClick={() => setTrainingOpen((v) => !v)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Training</CardTitle>
                        <CardDescription>Goals and difficulty help tune AI insights and plans.</CardDescription>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${trainingOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                  {!trainingOpen ? null : (
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-text-secondary mb-2">Fitness goals</p>
                      <div className="flex flex-wrap gap-2">
                        {GOAL_OPTIONS.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => toggleGoal(g)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                              fitnessGoals.includes(g)
                                ? 'border-accent-primary bg-accent-primary/15 text-accent-primary'
                                : 'border-border bg-white/5 text-text-secondary hover:border-accent-primary/30'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="block text-xs text-text-secondary">
                      Difficulty
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                      >
                        {DIFFICULTY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-text-secondary">
                      Equipment preference
                      <select
                        value={equipmentPreference}
                        onChange={(e) => setEquipmentPreference(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                      >
                        {EQUIPMENT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs text-text-secondary">
                      Weekly workout goal (days)
                      <input
                        type="number"
                        min={1}
                        max={7}
                        value={weeklyWorkoutDays}
                        onChange={(e) => setWeeklyWorkoutDays(e.target.value)}
                        placeholder="e.g. 4"
                        className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                      />
                    </label>
                  </CardContent>
                  )}
                </Card>

                <Card>
                  <CardHeader className="cursor-pointer" onClick={() => setBodyOpen((v) => !v)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Body &amp; activity</CardTitle>
                        <CardDescription>Used for BMI, diet calculator, and history graph.</CardDescription>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${bodyOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                  {!bodyOpen ? null : (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs text-text-secondary col-span-2 sm:col-span-1">
                        Age
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min={13}
                          max={100}
                          className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        />
                      </label>
                      <label className="text-xs text-text-secondary col-span-2 sm:col-span-1">
                        Sex (BMR / references)
                        <select
                          value={sex}
                          onChange={(e) => setSex(e.target.value as 'male' | 'female' | '')}
                          className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        >
                          <option value="">—</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </label>
                      <label className="text-xs text-text-secondary">
                        Height (cm)
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        />
                      </label>
                      <label className="text-xs text-text-secondary">
                        Weight (kg)
                        <input
                          type="number"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        />
                      </label>
                      <label className="text-xs text-text-secondary col-span-2">
                        Activity level
                        <select
                          value={activityLevel}
                          onChange={(e) => setActivityLevel(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary"
                        >
                          {ACTIVITY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </CardContent>
                  )}
                </Card>

                <Card>
                  <CardHeader className="cursor-pointer" onClick={() => setBioOpen((v) => !v)}>
                    <div className="flex items-center justify-between">
                      <CardTitle>Bio</CardTitle>
                      <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${bioOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                  {!bioOpen ? null : (
                  <CardContent>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 500))}
                      rows={4}
                      placeholder="Short intro, injuries to remember, or training notes…"
                      className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm text-text-primary resize-none"
                    />
                    <p className="text-xs text-text-secondary mt-1">{bio.length}/500</p>
                  </CardContent>
                  )}
                </Card>

                <Button type="button" className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save profile
                </Button>

                <Button type="button" variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onClose={() => setCropImageSrc(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
