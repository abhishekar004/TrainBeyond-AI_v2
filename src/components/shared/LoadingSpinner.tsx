import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={cn(
        'rounded-full border-transparent border-t-accent-primary animate-spin',
        sizes[size],
        className
      )}
      style={{ borderTopColor: '#6c63ff', borderWidth: size === 'lg' ? '3px' : '2px' }}
      role="status"
      aria-label="Loading"
    />
  );
}
