-- =============================================================================
-- TrainBeyond — run this ENTIRE file once in Supabase: SQL Editor → New query
-- =============================================================================
-- Prerequisites: your base schema already has `profiles`, `workout_plans`,
-- `generation_logs` (from the original TrainBeyond setup).
--
-- After running: wait ~10–30s if the app still errors (PostgREST schema cache),
-- then hard-refresh the browser (Ctrl+Shift+R).
-- =============================================================================

-- 1) Profiles: columns for diet, onboarding goals, bio, BMI history, avatar URL
--    (avatar_url + full_name already exist on typical profiles tables)
alter table public.profiles
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists age int,
  add column if not exists sex text,
  add column if not exists activity_level text,
  add column if not exists fitness_goal text,
  add column if not exists difficulty_level text,
  add column if not exists bio text,
  add column if not exists bmi_history jsonb not null default '[]'::jsonb,
  add column if not exists equipment_preference text,
  add column if not exists weekly_workout_days int;

-- 2) Gamification
create table if not exists public.user_gamification (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  level int not null default 1,
  level_name text not null default 'Rookie',
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date,
  badges jsonb not null default '[]'::jsonb,
  onboarding_completed boolean not null default false,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- If this table already existed from an older migration, CREATE TABLE does nothing — add any missing columns:
alter table public.user_gamification
  add column if not exists xp int not null default 0,
  add column if not exists level int not null default 1,
  add column if not exists level_name text not null default 'Rookie',
  add column if not exists current_streak int not null default 0,
  add column if not exists longest_streak int not null default 0,
  add column if not exists last_activity_date date,
  add column if not exists badges jsonb not null default '[]'::jsonb,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

alter table public.user_gamification enable row level security;

drop policy if exists "Users read own gamification" on public.user_gamification;
drop policy if exists "Users insert own gamification" on public.user_gamification;
drop policy if exists "Users update own gamification" on public.user_gamification;

create policy "Users read own gamification"
  on public.user_gamification for select using (auth.uid() = user_id);
create policy "Users insert own gamification"
  on public.user_gamification for insert with check (auth.uid() = user_id);
create policy "Users update own gamification"
  on public.user_gamification for update using (auth.uid() = user_id);

-- 3) AI Coach
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model_used text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists coach_messages_user_created_idx
  on public.coach_messages (user_id, created_at desc);

alter table public.coach_messages enable row level security;

drop policy if exists "Users read own coach messages" on public.coach_messages;
drop policy if exists "Users insert own coach messages" on public.coach_messages;
drop policy if exists "Users delete own coach messages" on public.coach_messages;

create policy "Users read own coach messages"
  on public.coach_messages for select using (auth.uid() = user_id);
create policy "Users insert own coach messages"
  on public.coach_messages for insert with check (auth.uid() = user_id);
create policy "Users delete own coach messages"
  on public.coach_messages for delete using (auth.uid() = user_id);

-- 4) Schedule completions (needs workout_plans)
create table if not exists public.schedule_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.workout_plans(id) on delete cascade,
  scheduled_date date not null,
  day_key text not null,
  completed boolean not null default false,
  notes text,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, plan_id, scheduled_date, day_key)
);

create index if not exists schedule_user_date_idx
  on public.schedule_completions (user_id, scheduled_date);

alter table public.schedule_completions enable row level security;

drop policy if exists "Users read own schedule completions" on public.schedule_completions;
drop policy if exists "Users insert own schedule completions" on public.schedule_completions;
drop policy if exists "Users update own schedule completions" on public.schedule_completions;
drop policy if exists "Users delete own schedule completions" on public.schedule_completions;

create policy "Users read own schedule completions"
  on public.schedule_completions for select using (auth.uid() = user_id);
create policy "Users insert own schedule completions"
  on public.schedule_completions for insert with check (auth.uid() = user_id);
create policy "Users update own schedule completions"
  on public.schedule_completions for update using (auth.uid() = user_id);
create policy "Users delete own schedule completions"
  on public.schedule_completions for delete using (auth.uid() = user_id);

-- Done.
