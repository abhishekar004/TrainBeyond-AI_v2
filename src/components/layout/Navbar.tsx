import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, LogOut, Menu, X, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MAIN_NAV, USER_MENU_NAV } from '@/config/navLinks';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const navLinkClass = (href: string) =>
    cn(
      'flex items-center gap-1.5 px-2 sm:px-2.5 py-2 rounded-lg text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap shrink-0',
      location.pathname === href
        ? 'bg-accent-primary/15 text-accent-primary shadow-sm ring-1 ring-accent-primary/25'
        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--color-bg-glass)] backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 min-h-14 sm:min-h-16 py-2 sm:py-0">
          <Link
            to={user ? '/home' : '/'}
            className="flex items-center gap-2 group shrink-0 min-w-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="p-1.5 rounded-lg bg-gradient-violet shrink-0">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-display font-bold text-sm sm:text-lg bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent truncate max-w-[10rem] sm:max-w-none">
              TrainBeyond AI
            </span>
          </Link>

          {user ? (
            <>
              <nav
                className="hidden md:flex flex-1 justify-end items-center gap-0.5 sm:gap-1 min-w-0 mx-1 lg:mx-2 overflow-x-auto no-scrollbar py-1 scroll-smooth touch-pan-x"
                aria-label="Main navigation"
              >
                {MAIN_NAV.map(({ href, label, icon: Icon }) => (
                  <Link key={href} to={href} className={navLinkClass(href)} title={label}>
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-90" aria-hidden />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="hidden md:flex items-center gap-1.5 shrink-0 border-l border-border/60 pl-2 lg:pl-3 ml-auto">
                <ThemeToggle />
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
                      dropdownOpen && "bg-white/5 ring-2 ring-accent-primary/20 text-text-primary border-accent-primary/30"
                    )}
                    aria-expanded={dropdownOpen}
                    aria-label="User menu"
                  >
                     <User className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-[var(--color-bg-glass)] backdrop-blur-2xl shadow-xl overflow-hidden z-50"
                      >
                         <div className="py-2 flex flex-col">
                           {USER_MENU_NAV.map(({ href, label, icon: Icon }) => (
                             <Link
                               key={href}
                               to={href}
                               onClick={() => setDropdownOpen(false)}
                               className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-text-secondary/10 transition-colors"
                             >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{label}</span>
                             </Link>
                           ))}
                           <div className="h-px w-full bg-border/50 my-1.5" />
                           <button
                             type="button"
                             onClick={() => {
                               setDropdownOpen(false);
                               handleLogout();
                             }}
                             className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:text-accent-danger hover:bg-accent-danger/20 transition-colors w-full text-left"
                           >
                             <LogOut className="w-4 h-4 shrink-0" />
                             <span>Sign out</span>
                           </button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">
              <a
                href="/#features"
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                How It Works
              </a>
              <Link
                to="/about"
                className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                About
              </Link>
              <ThemeToggle />
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors shadow-glow-violet"
              >
                Get Started
              </Link>
            </div>
          )}

          <div className="flex items-center gap-1.5 md:hidden ml-auto shrink-0">
            {user && <ThemeToggle />}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-[var(--color-bg-glass)] backdrop-blur-2xl overflow-hidden max-h-[min(85vh,520px)] overflow-y-auto overscroll-contain shadow-xl"
          >
            <div className="px-3 py-3 space-y-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {user && (
                <>
                  <div className="px-4 py-2 mt-1">
                    <span className="text-xs font-semibold text-text-primary/50 uppercase tracking-wider">Main Apps</span>
                  </div>
                  {MAIN_NAV.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all min-h-[48px]',
                        location.pathname === href
                          ? 'bg-accent-primary/15 text-accent-primary ring-1 ring-accent-primary/20'
                          : 'text-text-secondary active:bg-white/5'
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {label}
                    </Link>
                  ))}

                  <div className="mt-4 mb-2 h-px w-full bg-border/50" />
                  
                  <div className="px-4 py-2">
                    <span className="text-xs font-semibold text-text-primary/50 uppercase tracking-wider">Your Account</span>
                  </div>
                  
                  {USER_MENU_NAV.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all min-h-[44px]',
                        location.pathname === href
                          ? 'bg-accent-primary/15 text-accent-primary ring-1 ring-accent-primary/20'
                          : 'text-text-secondary active:bg-white/5'
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0 opacity-80" />
                      {label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 mt-1 rounded-xl text-base font-medium text-text-secondary hover:text-accent-danger hover:bg-accent-danger/10 transition-all min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 shrink-0 opacity-80" />
                    <span className="text-left">Sign out</span>
                  </button>
                </>
              )}
              {!user && (
                <>
                  <a
                    href="/#features"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-base font-medium text-text-secondary min-h-[48px] flex items-center"
                  >
                    Features
                  </a>
                  <a
                    href="/#how-it-works"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-base font-medium text-text-secondary min-h-[48px] flex items-center"
                  >
                    How It Works
                  </a>
                  <Link
                    to="/about"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-base font-medium text-text-secondary min-h-[48px] flex items-center"
                  >
                    About
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-base font-medium text-text-secondary min-h-[48px] flex items-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-base font-medium bg-accent-primary text-white text-center min-h-[48px] flex items-center justify-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
