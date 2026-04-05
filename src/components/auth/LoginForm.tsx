import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { signIn } from '@/services/auth.service';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';
import { AuthInputField } from '@/components/auth/AuthInputField';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onError?: (message: string) => void;
};

export function LoginForm({ onSuccess, onSwitchToSignup, onError }: LoginFormProps) {
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    onError?.('');
    try {
      sessionStorage.removeItem('tb-new-user');
      await signIn(data);
      toast.success('Welcome back!');
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      console.error(msg);
      onError?.('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <AuthInputField
        label="Email"
        id="login-email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <AuthInputField
        label="Password"
        id="login-password"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <button
        type="submit"
        disabled={isLoading}
        id="login-submit-btn"
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl 
                   bg-accent-primary text-white font-semibold hover:bg-accent-primary/90 
                   disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-glow-violet"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
      </button>
      <p className="text-center text-text-secondary text-sm">
        No account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-accent-primary hover:underline">
          Create one free
        </button>
      </p>
    </motion.form>
  );
}
