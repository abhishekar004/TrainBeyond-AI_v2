import type { LucideIcon } from 'lucide-react';
import {
  Home,
  LayoutDashboard,
  MessageCircle,
  UtensilsCrossed,
  CalendarDays,
  TrendingUp,
  Dumbbell,
  Sparkles,
  BookOpen,
  User,
  Info,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon };

/** Top nav (desktop scroll + mobile drawer): primary app navigation. */
export const MAIN_NAV: NavItem[] = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/planner', label: 'Planner', icon: Sparkles },
  { href: '/diet', label: 'Diet', icon: UtensilsCrossed },
  { href: '/coach', label: 'AI Coach', icon: MessageCircle },
];

/** User menu (dropdown on desktop + mobile drawer section) */
export const USER_MENU_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/plans', label: 'Plans', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];
