# ORBIT

**All Things Connected.** ORBIT is an integrated organisational management platform. Its first functional division is PerformX for performance management; ProjectX is planned as a later expansion.

## Application

- Next.js App Router, React, TypeScript, and Tailwind CSS.
- Supabase Auth for sign-in, registration, password recovery, and sessions.
- PostgreSQL with organisation-scoped tables and Row Level Security.
- Supabase Storage with private organisation folders.
- Designed for deployment on Vercel.

The application has no production demo account or seeded organisation data. New account registration creates a separate organisation workspace.

## Local setup

1. Install Node.js and pnpm.
2. Install the project dependencies with `pnpm install`.
3. Create a Supabase project and copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project settings. Set `SUPABASE_SERVICE_ROLE_KEY` only for the server-side staff invitation endpoint. Never put a service-role key in a `NEXT_PUBLIC_` variable.
5. Apply `supabase/migrations/202611040001_initial_schema.sql` in the Supabase SQL editor or with the Supabase CLI.
6. Add `http://localhost:3000/auth/callback` to the Supabase Auth redirect URL allowlist. Add the production `/auth/callback` URL before deployment.
7. Run `pnpm dev` and open `http://localhost:3000`.

Build with `pnpm build`; run the production server with `pnpm start`.

## Data isolation and access

Every organisational record carries an `organisation_id`. Authenticated access is controlled by PostgreSQL RLS policies that check active organisation membership and role. Registration creates an organisation administrator membership through a database trigger. The client uses only the public Supabase key; database authorization remains in PostgreSQL.

Default organisation roles are `org_admin`, `manager`, `department_head`, and `staff`. The schema includes departments, staff profiles, tasks and subtasks, measurable goals and updates, performance cycles and reviews, assets and maintenance, announcements, messages, notifications, saved reports, and activity records.

## Deployment notes

In Vercel, set the same two public environment variables for the intended environment and configure the matching Supabase Auth redirect URL. Apply database migrations to the matching Supabase project before deploying. Use separate Supabase projects for development and production. Do not include real organisational data in public previews.

## Current implementation status

The original interface is being migrated from demo content to persistent, organisation-scoped workflows. Some screens still need to be connected to database-backed CRUD operations. Do not treat a visible screen as proof that its workflow is complete.
