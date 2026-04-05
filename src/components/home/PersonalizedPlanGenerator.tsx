import { Link } from 'react-router-dom';
import { SlidersHorizontal, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';

const ACTIVITY_DISPLAY: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Active',
  athlete: 'Athlete',
};

export function PersonalizedPlanGenerator() {
  const { profile, isLoading } = useProfile();

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

  return (
    <Card className="border-accent-primary/25 bg-gradient-to-br from-accent-primary/[0.07] via-bg-card to-bg-card overflow-hidden">
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
    </Card>
  );
}
