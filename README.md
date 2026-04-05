# TrainBeyond-AI

**TrainBeyond-AI** is a production-oriented fitness planner SaaS: users complete a workout profile, an AI model returns a structured weekly plan, and plans can be saved, browsed, and regenerated. The stack is React 18 + TypeScript + Vite, Tailwind, Supabase (auth + Postgres + RLS), and OpenRouter for model calls.

## Screenshots

Add screenshots of the landing page, planner (form + plan), dashboard, and saved plans here after deployment (e.g. store under `docs/` and link them in this section).

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS, Framer Motion |
| Routing | React Router |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Auth & database | Supabase |
| AI | OpenRouter (`qwen/qwen3-235b-a22b:free`, fallback `nvidia/llama-3.1-nemotron-ultra-253b-v1:free`) |
| Notifications | Sonner |
| Charts | Recharts |
| Theming | next-themes (light / dark / system) |
| UI primitives | Radix UI (tabs, scroll area, slot) + shadcn-style components |

## Features

- **Auth & profile** — Supabase sign-in/up, protected routes, onboarding (`/onboarding`), profile + optional biometrics for diet  
- **Landing (`/`)** — Marketing site; signed-in banner to `/home`  
- **App home (`/home`)** — Level / XP hero, quick links (Coach, Diet, Schedule, Progress, Workouts), adaptive insights, gamification card, personalized plan CTA  
- **Workouts (`/workouts`)** — Saved AI plans overview; ties into planner + Supabase `workout_plans`  
- **AI Coach (`/coach`)** — Chat UI, history in `coach_messages`, quick prompts, OpenRouter primary + fallback  
- **Diet (`/diet`)** — Mifflin–St Jeor calculator + Indian meal ideas; save biometrics to `profiles`  
- **Schedule (`/schedule`)** — Weekly plan adherence toggles, XP rewards, nudges for missed days  
- **Progress (`/progress`)** — Completion analytics (Recharts)  
- **Gamification** — XP, named levels, streaks, badges in `user_gamification` (see SQL extension)  
- **Planner / Plans** — Existing AI plan flow, save, list, delete  
- **Dashboard** — Stats snapshot  
- **Theming** — Theme toggle in navbar & sidebar (Tailwind colors follow CSS variables)  

Run **`supabase/schema-extensions.sql`** in the Supabase SQL editor after the base tables so gamification, coach chat, schedule completions, and profile biometrics columns exist.  

## Local setup

1. **Clone** the repo and install dependencies:

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env` and fill in:

   | Variable | Description |
   | --- | --- |
   | `VITE_SUPABASE_URL` | Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
   | `VITE_OPENROUTER_API_KEY` | OpenRouter API key |

   Do not commit `.env` (it is listed in `.gitignore`).

3. **Supabase** — in the SQL editor, run the schema and RLS policies from the project brief (tables: `profiles`, `workout_plans`, `generation_logs`, policies, and the `handle_new_user` trigger). Then run **`supabase/schema-extensions.sql`** for `user_gamification`, `coach_messages`, `schedule_completions`, and extended `profiles` columns.  
   - On PostgreSQL 15+ triggers typically use `execute function` instead of `execute procedure`; adjust the trigger line if the editor reports an error.

4. **Redirect URLs** — in Supabase **Authentication → URL Configuration**, add:

   - `http://localhost:5173` (local)  
   - Your production site URL after Vercel deploy  

5. **Run** the dev server:

   ```bash
   npm run dev
   ```

6. **Production build**:

   ```bash
   npm run build
   ```

## Deployment (Vercel + Supabase)

1. Push the repository to GitHub and import the project in Vercel.  
2. Set **Build command**: `npm run build`; **Output directory**: `dist`.  
3. Add the same `VITE_*` environment variables in Vercel.  
4. Add the Vercel URL to Supabase auth redirect URLs.  

## Future roadmap

- Plan versioning and edit-in-place  
- Export to PDF / calendar  
- Mobile app shell (Capacitor / PWA)  
- Team and coach roles  

## License

Private / all rights reserved unless you add an explicit OSS license.
