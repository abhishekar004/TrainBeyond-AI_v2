import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  label: React.ReactNode;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  optional?: boolean;
};

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className,
  optional,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-text-secondary"
      >
        {label}
        {optional ? (
          <span className="text-text-secondary/50 font-normal"> (optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-accent-danger text-xs">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
