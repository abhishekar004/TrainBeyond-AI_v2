-- Run in Supabase → SQL Editor if you see:
-- "Could not find the 'weekly_workout_days' column of 'profiles' in the schema cache"
-- Then wait ~10–30s and hard-refresh the app (Ctrl+Shift+R).

alter table public.profiles
  add column if not exists equipment_preference text,
  add column if not exists weekly_workout_days int;
