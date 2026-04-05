import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { signUp } from '@/services/auth.service';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { toast } from 'sonner';
import { AuthInputField } from '@/components/auth/AuthInputField';

const signupSchema = z
  .object({
    email: z.string().email('Valid email required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

type SignupFormProps = {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onError?: (message: string) => void;
};

export function SignupForm({ onSuccess, onSwitchToLogin, onError }: SignupFormProps) {
  const form = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    onError?.('');
    try {
      sessionStorage.setItem('tb-new-user', '1');
      await signUp({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      toast.success('Account created! Welcome to TrainBeyond.');
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      onError?.(msg);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <motion.form
      key="signup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <AuthInputField
        label="Full Name"
        id="signup-name"
        type="text"
        icon={User}
        placeholder="John Doe"
        error={form.formState.errors.full_name?.message}
        {...form.register('full_name')}
      />
      <AuthInputField
        label="Email"
        id="signup-email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <AuthInputField
        label="Password"
        id="signup-password"
        type="password"
        icon={Lock}
        placeholder="Min 6 characters"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <AuthInputField
        label="Confirm Password"
        id="signup-confirm-password"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        error={form.formState.errors.confirmPassword?.message}
        {...form.register('confirmPassword')}
      />
      <button
        type="submit"
        disabled={isLoading}
        id="signup-submit-btn"
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl 
                   bg-accent-primary text-white font-semibold hover:bg-accent-primary/90 
                   disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-glow-violet"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : 'Create Account'}
      </button>
      <p className="text-center text-text-secondary text-sm">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-accent-primary hover:underline">
          Sign in
        </button>
      </p>
    </motion.form>
  );
}
