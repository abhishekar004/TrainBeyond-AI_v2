import { Link } from 'react-router-dom';
import { SlidersHorizontal, Wand2, Target, Calendar, Clock, Wrench, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { usePlans } from '@/hooks/usePlans';
import { GOAL_LABELS, EQUIPMENT_LABELS, BODY_FOCUS_LABELS } from '@/lib/constants';

const ACTIVITY_DISPLAY: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Active',
  athlete: 'Athlete',
};

function PlanPreviewItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="p-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
        <Icon className="w-3.5 h-3.5 text-accent-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

export function PersonalizedPlanGenerator() {
  const { profile, isLoading } = useProfile();
  const { plans } = usePlans();

  const latestPlan = plans[0] ?? null;
  const goalSnippet = profile?.fitness_goal?.split(',')[0]?.trim() || 'your fitness';
  const h = profile?.height_cm;
  const w = profile?.weight_kg;
  const actKey = profile?.activity_level ?? '';
  const activityLabel = actKey ? ACTIVITY_DISPLAY[actKey] ?? actKey : null;
  const metricsParts = [
    h != null && h > 0 ? `${Math.round(h)}cm` : null,
    w != null && w > 0 ? `${w}kg` : null,
    activityLabel,
  ].filter(Boolean);
  const metricsLine = metricsParts.length > 0 ? metricsParts.join(', ') : null;

  // Preview data from latest plan or profile defaults
  const previewGoal = latestPlan
    ? GOAL_LABELS[latestPlan.goal] ?? latestPlan.goal
    : profile?.fitness_goal?.split(',')[0]?.trim() || 'General Fitness';
  const previewPlanType = latestPlan
    ? BODY_FOCUS_LABELS[latestPlan.body_focus] ?? latestPlan.body_focus
    : 'Full Body';
  const previewDays = latestPlan ? `${latestPlan.days_per_week} days/week` : profile?.weekly_workout_days ? `${profile.weekly_workout_days} days/week` : '3 days/week';
  const previewDuration = latestPlan ? `${latestPlan.duration} min` : '45 min';
  const previewEquipment = latestPlan
    ? EQUIPMENT_LABELS[latestPlan.equipment] ?? latestPlan.equipment
    : EQUIPMENT_LABELS[profile?.equipment_preference ?? ''] ?? 'Home Equipment';

  return (
    <Card className="border-accent-primary/25 bg-gradient-to-br from-accent-primary/[0.07] via-bg-card to-bg-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
        {/* Left — CTA */}
        <div>
          <CardHeader className="pb-2 space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent-primary/15 border border-accent-primary/25">
                <SlidersHorizontal className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Ready to Generate Your Personalized Plan
                </h2>
                <p className="text-sm text-text-secondary mt-1 max-w-2xl">
                  We have your profile details. Our AI will build a hyper-personalized plan tailored to your{' '}
                  <span className="text-text-primary font-medium">{goalSnippet}</span> goal using your body metrics and
                  activity.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            <Button asChild size="lg" className="w-full sm:w-auto text-base shadow-glow-violet">
              <Link to="/planner">
                <Wand2 className="w-4 h-4" />
                Generate My AI Plan
              </Link>
            </Button>
            <p className="text-xs text-text-secondary">
              {isLoading && 'Loading profile…'}
              {!isLoading && metricsLine && (
                <>
                  Using profile data: <span className="text-text-primary font-medium">{metricsLine}</span>
                </>
              )}
              {!isLoading && !metricsLine && 'Complete your profile for richer plan context.'}
            </p>
          </CardContent>
        </div>

        {/* Right — Today's Plan Preview */}
        <div className="border-t lg:border-t-0 lg:border-l border-accent-primary/15 p-5 bg-white/[0.02]">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
            {latestPlan ? "Today's Plan Preview" : 'Default Plan Settings'}
          </p>
          <div className="space-y-0.5 divide-y divide-border/40">
            <PlanPreviewItem icon={Target} label="Goal" value={previewGoal} />
            <PlanPreviewItem icon={Layers} label="Plan Type" value={previewPlanType} />
            <PlanPreviewItem icon={Calendar} label="Frequency" value={previewDays} />
            <PlanPreviewItem icon={Clock} label="Duration" value={previewDuration} />
            <PlanPreviewItem icon={Wrench} label="Equipment" value={previewEquipment} />
          </div>
        </div>
      </div>
    </Card>
  );
}
