-- Run in Supabase SQL editor after base TrainBeyond tables exist.
-- Extends profiles for diet/biometrics; adds gamification, coach chat, schedule completions.

-- Optional biometrics on profiles (diet calculator persistence)
alter table public.profiles
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists age int,
  add column if not exists sex text,
  add column if not exists activity_level text,
  add column if not exists fitness_goal text,
  add column if not exists difficulty_level text,
  add column if not exists bio text,
  add column if not exists bmi_history jsonb not null default '[]'::jsonb;

-- Optional: public avatar bucket for Profile photo uploads
-- Run in SQL editor after enabling Storage:
/*
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar read"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Avatar upload own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatar update own"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Avatar delete own"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
*/

-- Gamification (XP, levels, streaks, badges)
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

-- Backfill if table already existed without newer columns (CREATE TABLE IF NOT EXISTS does not alter)
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

create policy "Users read own gamification"
  on public.user_gamification for select using (auth.uid() = user_id);
create policy "Users insert own gamification"
  on public.user_gamification for insert with check (auth.uid() = user_id);
create policy "Users update own gamification"
  on public.user_gamification for update using (auth.uid() = user_id);

-- AI Coach chat history
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

create policy "Users read own coach messages"
  on public.coach_messages for select using (auth.uid() = user_id);
create policy "Users insert own coach messages"
  on public.coach_messages for insert with check (auth.uid() = user_id);
create policy "Users delete own coach messages"
  on public.coach_messages for delete using (auth.uid() = user_id);

-- Schedule / completion tracking (weekly plan adherence)
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

create policy "Users read own schedule completions"
  on public.schedule_completions for select using (auth.uid() = user_id);
create policy "Users insert own schedule completions"
  on public.schedule_completions for insert with check (auth.uid() = user_id);
create policy "Users update own schedule completions"
  on public.schedule_completions for update using (auth.uid() = user_id);
create policy "Users delete own schedule completions"
  on public.schedule_completions for delete using (auth.uid() = user_id);
