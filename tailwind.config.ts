import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          card:      'var(--color-bg-card)',
        },
        accent: {
          primary:   'var(--color-accent-primary)',
          secondary: 'var(--color-accent-secondary)',
          danger:    'var(--color-accent-danger)',
          energy:    'var(--color-accent-energy)',
          success:   'var(--color-accent-success)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        border: 'var(--color-border)',
      },
      fontFamily: {
        display: ['Syne',       'sans-serif'],
        body:    ['Outfit',     'sans-serif'],
        stat:    ['Space Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm:  '8px',
        lg:  '16px',
        xl:  '20px',
        '2xl': '24px',
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        // Dark — Electric Violet → Neon Cyan
        'gradient-violet':  'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        // Light — Indigo → Teal
        'gradient-indigo':  'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
        // Energy gradient for cardio cards
        'gradient-energy':  'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
        'gradient-dark':    'linear-gradient(180deg, #0d0d14 0%, #06060a 100%)',
        'gradient-glow-v':  'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%)',
        'gradient-glow-c':  'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.20) 0%, transparent 70%)',
      },
      animation: {
        'spin-slow':   'spin 3s linear infinite',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'icon-pulse':  'iconPulse 0.6s ease-in-out',
        'shimmer':     'shimmer 2s linear infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        iconPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-violet': 'var(--glow-violet)',
        'glow-cyan':   'var(--glow-cyan)',
        'glow-orange': 'var(--glow-orange)',
        'card':        '0 4px 32px rgba(0, 0, 0, 0.35)',
        'card-hover':  '0 8px 48px rgba(0, 0, 0, 0.45)',
        'inner-glow':  'inset 0 0 20px rgba(124, 58, 237, 0.12)',
      },
    },
  },
  plugins: [animate],
}

export default config
