# Supabase setup (step by step)

The app expects extra **columns** on `profiles` and extra **tables** (`user_gamification`, `coach_messages`, `schedule_completions`). If you see errors like **“Could not find the `fitness_goal` column of `profiles`”**, you have not applied this SQL yet.

## Before you start

1. You already created the **original** TrainBeyond tables: `profiles`, `workout_plans`, `generation_logs`, auth trigger, etc.
2. Your project has **Authentication** enabled and you use the **anon** key in `.env`.

## Steps

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.

2. In the left sidebar, click **SQL Editor**.

3. Click **New query**.

4. Open the file in this repo: **`supabase/RUN_IN_SUPABASE.sql`**.

5. **Copy the entire file** and paste it into the SQL Editor.

6. Click **Run** (or press the shortcut shown in the editor).

7. You should see **Success** with no errors. If something fails:
   - **Missing `workout_plans`**: run your original TrainBeyond schema first (the file that creates `workout_plans`), then run `RUN_IN_SUPABASE.sql` again.
   - **Policy already exists**: the script uses `DROP POLICY IF EXISTS` before recreating policies; if your policy names differ, say what error you get.

8. Wait **10–30 seconds** (API schema cache), then in the app do a **hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac).

9. Try **onboarding** or **profile save** again.

## Optional: profile photo uploads (Storage)

1. **Storage** → **New bucket** → name: `avatars` → **Public bucket** (if you want public URLs).

2. In **SQL Editor**, you can add policies so users only upload under their own folder. See commented block in `schema-extensions.sql` (same policies as in project docs), or use Supabase **Storage** UI policy templates for “authenticated users can upload to `avatars/{userId}/...`”.

## “`onboarding_completed` missing on `user_gamification`”

That usually means the **`user_gamification` table already existed** from an older script, so `CREATE TABLE IF NOT EXISTS` did **not** add new columns.

**Fix:** run the **updated** `RUN_IN_SUPABASE.sql` from this repo (it now includes `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for `user_gamification`), **or** run the one-liner in `HOTFIX_user_gamification_onboarding_column.sql`, then refresh the app.

## Verify columns (optional)

In **SQL Editor**:

```sql
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles'
order by column_name;
```

You should see `fitness_goal`, `bmi_history`, `difficulty_level`, etc.
