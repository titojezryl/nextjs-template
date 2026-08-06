# Next.js Template

A lightweight Next.js starter for authenticated products: landing page, Google SSO + email/password, admin role management, password reset (self-serve and admin-triggered), and an audit trail — on Drizzle ORM and Postgres.

No client-side data-fetching library. Server Components and Server Actions are the default.

## Stack

| Piece | Version (pinned at create time) |
| --- | --- |
| Next.js | 16.3 |
| React | 19.2 |
| Better Auth | 1.6 (admin plugin) |
| Drizzle ORM | 0.45 |
| Postgres | 17 (Docker) |
| Tailwind CSS | 4.3 |
| Zod | 4.4 |
| Resend | 6.x (optional) |

## Get your own copy

**GitHub template (preferred)**

1. Click **Use this template** on the repository page
2. Clone your new repo
3. Continue with [Quick start](#quick-start)

**Clone**

```bash
git clone <this-repo-url> my-app
cd my-app
git remote remove origin
# Optionally: rm -rf .git && git init
```

## Prerequisites

- Node.js 20+ (verified on 24.13)
- pnpm 11+
- Docker (for local Postgres)

## Quick start

```bash
pnpm install
cp .env.example .env.local
npx @better-auth/cli secret
# Paste the secret into BETTER_AUTH_SECRET in .env.local
# Set ADMIN_EMAILS to the email you will sign up with

docker compose up -d
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), sign up with an address listed in `ADMIN_EMAILS`, then open `/users` and `/audit`.

## Google OAuth setup

1. Create an OAuth client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Application type: Web application
3. Authorized redirect URIs:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://your-domain.com/api/auth/callback/google`
4. Put the client ID and secret in `.env.local` as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
5. Restart `pnpm dev`

Until those are set, the Google button still appears on login/signup and explains how to configure OAuth when clicked. Email/password works either way.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Audit path-mapping unit checks (`node:test`) |
| `pnpm verify` | typecheck + lint + test + build (required after feature work) |
| `pnpm db:generate` | Generate SQL from Drizzle schema |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema (dev only — never production) |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm auth:generate` | Regenerate Better Auth Drizzle schema |

## Project structure

```
src/
  app/
    (auth)/          # login, signup, forgot/reset password
    (dashboard)/     # side-nav admin: /users, /users/[id], /audit
    api/auth/        # Better Auth handler
  components/        # UI + feature components
  db/schema/         # auth + audit tables
  lib/               # auth, env, mail, audit helpers
proxy.ts             # Next.js 16 optimistic auth redirect
drizzle/             # SQL migrations
docs/qa/             # QA test cases
```

## Environment variables

See [`.env.example`](.env.example) for the source of truth.

**Required:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ADMIN_EMAILS`

**Optional:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`

Without Resend, password-reset links are printed to the server console — fine for local development, not for production.

## Database workflow

1. Edit `src/db/schema/*`
2. `pnpm db:generate` — review the SQL under `drizzle/`
3. `pnpm db:migrate`
4. Commit the migration files

Use `db:push` only for throwaway local experiments. Production always uses migrations.

## Data fetching

Default: Server Components for reads, Server Actions for mutations, `revalidatePath` / router refresh after writes. Session on the client comes from Better Auth's `useSession`.

React Query is **not** included. TanStack Query 5 works with Next.js 16, but this template stays lightweight. Add it when you need polling, infinite scroll, shared client caches across many client components, offline/window-focus refetch, or a migration that already uses `useQuery`.

Minimal add-on sketch:

```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

## Roles and audit trail

- Default role: `user`
- Emails in `ADMIN_EMAILS` become `admin` on first sign-up
- Admins manage users at `/users` and read events at `/audit`
- Captured actions: `login`, `logout`, `role_changed`, `password_reset_requested`, `password_reset_self`, `password_reset_by_admin`

## Production build checklist

- [ ] Fresh `BETTER_AUTH_SECRET` (never the local value)
- [ ] `BETTER_AUTH_URL` is the real HTTPS origin; Google callback URI updated
- [ ] `DATABASE_URL` points at managed Postgres with `sslmode=require`
- [ ] `pnpm db:migrate` against production (not `db:push`)
- [ ] `RESEND_API_KEY` set with a verified sending domain
- [ ] `ADMIN_EMAILS` narrowed to real admins
- [ ] `pnpm build`, `pnpm lint`, and `pnpm test` clean
- [ ] Session cookies confirmed `Secure` / `httpOnly` over HTTPS
- [ ] Rate limiting considered for auth endpoints
- [ ] Secrets injected by the host; `.env.local` not deployed from the repo
- [ ] Retention/backup decision recorded for `audit_log`

## Deployment notes

- `src/proxy.ts` runs on the **Node** runtime (Next.js 16 `proxy` convention), not Edge
- Prefer a Node-capable host (Node server / container). Confirm your platform supports `proxy.ts`
- Append `?sslmode=require` (or equivalent) for managed Postgres

## QA

Manual test cases live in [`docs/qa/`](docs/qa/).

Feature and architecture docs live in [`docs/`](docs/) — start at [`docs/README.md`](docs/README.md).
