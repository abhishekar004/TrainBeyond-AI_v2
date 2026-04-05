-- Quick fix if you see: "Could not find the `onboarding_completed` column of `user_gamification`"
-- Run this alone in SQL Editor, then hard-refresh the app (Ctrl+Shift+R).

alter table public.user_gamification
  add column if not exists onboarding_completed boolean not null default false;

-- Prefer re-running the full supabase/RUN_IN_SUPABASE.sql so all columns/policies stay in sync.
