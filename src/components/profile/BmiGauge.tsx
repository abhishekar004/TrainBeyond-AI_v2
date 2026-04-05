import { bmiCategory } from '@/lib/bmi';

type Props = {
  bmi: number;
};

/** WHO-style scale 15–40 with marker. */
export function BmiGauge({ bmi }: Props) {
  if (bmi <= 0) {
    return (
      <p className="text-sm text-text-secondary">Enter height and weight to see your position on the scale.</p>
    );
  }

  const meta = bmiCategory(bmi);
  const displayLabel =
    meta.label === 'Normal' ? 'Normal weight' : meta.label;
  const pct = Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100));

  const ticks = [
    { v: 15, label: '15' },
    { v: 18.5, label: '18.5' },
    { v: 25, label: '25' },
    { v: 30, label: '30' },
    { v: 40, label: '40' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide">BMI Tracker</p>
          <p className="font-display text-5xl font-black text-text-primary leading-none">{bmi}</p>
          <p className={`text-sm font-semibold mt-2 ${meta.color}`}>{displayLabel}</p>
        </div>
        <div className="text-right text-xs text-text-secondary">
          <p className="font-medium text-text-primary">You ({bmi})</p>
        </div>
      </div>

      <div className="relative pt-2">
        <div
          className="relative h-10 rounded-full overflow-hidden w-full border border-border"
          style={{
            minHeight: 40,
            background:
              'linear-gradient(to right, #0c4a6e 0%, #0369a1 14%, #059669 40%, #ca8a04 60%, #b91c1c 100%)',
          }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-10 pointer-events-none"
          style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
        />
        <div className="flex justify-between text-[10px] text-text-secondary mt-2 px-0.5">
          {ticks.map((t) => (
            <span key={t.v}>{t.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
