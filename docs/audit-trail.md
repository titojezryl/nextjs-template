# Audit trail

## Purpose

Immutable-ish history of auth and admin events for operators: who did what, to whom, with optional metadata (e.g. role from/to).

## When users encounter it

Admins open `/audit` from the side nav or landing “View audit trail” CTA.

## Routes / entry points

| Route | File |
| --- | --- |
| `/audit` | `src/app/(dashboard)/audit/page.tsx` |

## How writes work

Not written from the audit page. A single Better Auth `hooks.after` (and `before` for role stash) in `src/lib/auth.ts` calls `writeAuditLog` (`src/lib/audit-writer.ts`) after mapped endpoints.

Path → action mapping: `resolveAuditAction` in `src/lib/audit.ts`

| Path pattern | Action |
| --- | --- |
| `/sign-in/email`, `/callback/*`, `/sign-in/social` | `login` |
| `/sign-out` | `logout` |
| `/admin/set-role` | `role_changed` |
| `/admin/set-user-password` | `password_reset_by_admin` |
| `/request-password-reset`, `/forget-password` | `password_reset_requested` |
| `/reset-password` | `password_reset_self` |

Schema: `audit_log` in `src/db/schema/audit.ts` (actor/target ids + denormalized emails, jsonb metadata, ip, user agent).

## How reads work

- Admin-only page: `requireAdmin()`
- Drizzle query with optional filters: `action`, actor email substring, pagination (`PAGE_SIZE = 20`)

## Auth requirements

- Read: `requireAdmin()`
- Write: happens inside authenticated Better Auth pipeline; failures are swallowed so audit never breaks auth

## Unit check

`src/lib/audit.test.ts` — path mapping and `buildAuditEntry` shape (`pnpm test`).

## QA

[docs/qa/audit-trail.test-cases.md](./qa/audit-trail.test-cases.md)
