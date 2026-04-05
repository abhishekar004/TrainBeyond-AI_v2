import type { Exercise } from '@/types/workout';

interface ExerciseTableProps {
  exercises: Exercise[];
}

export function ExerciseTable({ exercises }: ExerciseTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-white/[0.03]">
            <th className="text-left px-4 py-3 text-text-secondary font-medium">#</th>
            <th className="text-left px-4 py-3 text-text-secondary font-medium">Exercise</th>
            <th className="text-center px-4 py-3 text-text-secondary font-medium">Sets</th>
            <th className="text-center px-4 py-3 text-text-secondary font-medium">Reps</th>
            <th className="text-center px-4 py-3 text-text-secondary font-medium">Rest</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, idx) => (
            <tr
              key={idx}
              className="border-b border-border/50 last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <td className="px-4 py-3 text-text-secondary">{idx + 1}</td>
              <td className="px-4 py-3 text-text-primary font-medium">{ex.name}</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary font-semibold text-xs">
                  {ex.sets}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-accent-secondary font-medium">
                {ex.reps}
              </td>
              <td className="px-4 py-3 text-center text-text-secondary">{ex.rest}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
