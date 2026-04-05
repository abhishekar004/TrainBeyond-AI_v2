import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup');
  const [globalError, setGlobalError] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;
    if (sessionStorage.getItem('tb-new-user')) {
      sessionStorage.removeItem('tb-new-user');
      navigate('/onboarding', { replace: true });
      return;
    }
    navigate('/home', { replace: true });
  }, [user, loading, navigate]);

  const toggle = () => {
    setIsSignup((v) => !v);
    setGlobalError('');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-primary/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-violet">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-text-primary">
              Train<span className="text-accent-primary">Beyond</span>
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-bg-card p-8 shadow-card"
        >
          <div className="flex bg-white/5 rounded-xl p-1 mb-8">
            {['Login', 'Sign Up'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setIsSignup(tab === 'Sign Up')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  (isSignup ? 'Sign Up' : 'Login') === tab
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {globalError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-accent-danger/10 border border-accent-danger/20 
                           flex items-center gap-2 text-accent-danger text-sm overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {globalError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isSignup ? (
              <LoginForm
                key="login-form"
                onSuccess={() => navigate('/home')}
                onSwitchToSignup={toggle}
                onError={setGlobalError}
              />
            ) : (
              <SignupForm
                key="signup-form"
                onSuccess={() => {
                  /* navigation handled in Auth useEffect via sessionStorage flag */
                }}
                onSwitchToLogin={toggle}
                onError={setGlobalError}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
