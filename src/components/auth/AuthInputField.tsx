import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

type AuthInputFieldProps = {
  label: string;
  id: string;
  type: string;
  error?: string;
  icon: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AuthInputField({
  label,
  id,
  type,
  error,
  icon: Icon,
  ...props
}: AuthInputFieldProps) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
        <input
          id={id}
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-border 
                     text-text-primary placeholder:text-text-secondary/40 text-sm
                     focus:outline-none focus:border-accent-primary/60 focus:ring-1 
                     focus:ring-accent-primary/20 transition-all"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 hover:text-text-secondary"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-accent-danger text-xs mt-1.5">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
