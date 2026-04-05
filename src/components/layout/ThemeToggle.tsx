import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span className={cn('inline-flex h-9 w-9 rounded-lg border border-border bg-bg-card', className)} />
    );
  }

  const cycle = () => {
    if (theme === 'system' || !theme) setTheme('dark');
    else if (resolvedTheme === 'dark') setTheme('light');
    else setTheme('system');
  };

  const Icon = theme === 'system' || !theme ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={cycle}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-card',
        'text-text-secondary hover:text-text-primary hover:border-accent-primary/40 transition-colors',
        className
      )}
      title={`Theme: ${theme === 'system' ? 'system' : resolvedTheme}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
