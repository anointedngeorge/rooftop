# Rooftop Hub Sales & Customer Management MVP

A production-structured client demonstration built with Vite, React, TanStack Router and Supabase.

## What is included

- Independent Super Admin, Staff, Marketer, Partner and Customer route trees
- Role-aware dashboards and navigation
- CRUD modules for customers, users, products, categories, sales, targets, commissions, wallets, withdrawals, orders, payments, notifications and feedback
- Comprehensive Super Admin settings
- Supabase email/password authentication, PostgreSQL persistence, Storage and RLS
- Secure `admin-users` Edge Function for user lifecycle administration
- Client preview mode for all five roles

## Local setup

Requirements: Node.js 20+ and npm 10+.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local browser configuration:

   ```bash
   cp .env.example .env.local
   ```

   Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in
   `.env.local`. Both are browser-safe project values from Supabase project
   settings.

3. Apply the database schema by running
   `supabase/migrations/202609140001_rooftop_hub_mvp.sql` in the Supabase SQL
   Editor.

4. Deploy the secure user-administration Edge Function:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_ID
   npx supabase functions deploy admin-users
   ```

   `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
   supplied to hosted Edge Functions by Supabase. Do not add the service-role
   or secret key to `.env.local`.

5. Create the first user in Supabase Authentication. The migration creates its
   matching `profiles` row automatically. Promote it in the SQL Editor:

   ```sql
   update public.profiles
   set role = 'super_admin', status = 'active'
   where id = 'AUTH_USER_UUID';
   ```

6. Start development:

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite and sign in with the Super Admin user.

## Production build

```bash
npm run typecheck
npm run build
npm run preview
```

The deploy target must define the same two `VITE_SUPABASE_*` values during the
build. Configure SPA fallback/rewrites so TanStack Router routes resolve to
`index.html`.

## Environment-variable safety

| Variable | Where it belongs | Safe in browser |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `.env.local` and frontend host | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env.local` and frontend host | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function runtime only | No |
| `SUPABASE_SECRET_KEY` | Server-side systems only | No |

Never add a Supabase secret or service-role key to a `VITE_` environment variable.
