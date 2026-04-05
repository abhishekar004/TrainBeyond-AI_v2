import { addDays, format, startOfWeek } from 'date-fns';

/** ISO week (Mon–Sun) dates with weekday labels. */
export function getIsoWeekSlots(anchor: Date = new Date()): { date: string; label: string }[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return labels.map((label, i) => ({
    label,
    date: format(addDays(start, i), 'yyyy-MM-dd'),
  }));
}

/** Match a plan day string (e.g. "Monday" or "Day 1 — Upper") to a slot index 0–6 if possible */
export function slotIndexForPlanDay(dayStr: string): number | null {
  const lower = dayStr.toLowerCase();
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (let i = 0; i < weekdays.length; i++) {
    if (lower.includes(weekdays[i])) return i;
  }
  return null;
}
