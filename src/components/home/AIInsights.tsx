import { motion } from 'framer-motion';
import { Lightbulb, Sparkles } from 'lucide-react';
import type { Insight } from '@/lib/insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const toneStyle = {
  tip: 'border-accent-primary/20 bg-accent-primary/5',
  nudge: 'border-accent-secondary/30 bg-accent-secondary/5',
  celebrate: 'border-accent-secondary/20 bg-gradient-to-br from-accent-secondary/10 to-transparent',
} as const;

export function AIInsights({ insights }: { insights: Insight[] }) {
  return (
    <Card className="border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-accent-primary" />
          AI insights
        </CardTitle>
        <p className="text-sm text-text-secondary">Adaptive suggestions based on your streak and schedule (instant — no API call).</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((ins, i) => (
          <motion.div
            key={`${ins.title}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex gap-3 p-4 rounded-xl border ${toneStyle[ins.tone]}`}
          >
            <Lightbulb className="w-5 h-5 text-accent-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary text-sm">{ins.title}</p>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">{ins.body}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
