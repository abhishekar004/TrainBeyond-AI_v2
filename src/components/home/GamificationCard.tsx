import { Flame, Award } from 'lucide-react';
import type { DbUserGamification } from '@/types/db';
import { BADGE_DEFINITIONS } from '@/lib/levelSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = { data: DbUserGamification | null };

export function GamificationCard({ data }: Props) {
  const badges = data?.badges ?? [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="w-5 h-5 text-orange-400" />
          Streaks & badges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-white/5 p-4">
            <p className="text-xs text-text-secondary">Current streak</p>
            <p className="font-display text-2xl font-bold text-text-primary">{data?.current_streak ?? 0} days</p>
          </div>
          <div className="rounded-xl border border-border bg-white/5 p-4">
            <p className="text-xs text-text-secondary">Best streak</p>
            <p className="font-display text-2xl font-bold text-accent-secondary">{data?.longest_streak ?? 0} days</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-2 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Badges unlocked
          </p>
          <div className="flex flex-wrap gap-2">
            {BADGE_DEFINITIONS.filter((b) => badges.includes(b.id)).map((b) => (
              <span
                key={b.id}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-accent-primary/15 text-accent-primary border border-accent-primary/25"
                title={b.desc}
              >
                {b.label}
              </span>
            ))}
            {badges.length === 0 && (
              <span className="text-sm text-text-secondary">Complete workouts to earn your first badge.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
