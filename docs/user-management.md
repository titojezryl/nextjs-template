# User management

## Purpose

Admins list users, open a user detail page, change roles, and set a new password for a user.

## When users encounter it

Only when `session.user.role === "admin"` — via landing admin CTAs, header Dashboard/Users, or side nav.

## Routes / entry points

| Route | File |
| --- | --- |
| `/users` | `src/app/(dashboard)/users/page.tsx` |
| `/users/[id]` | `src/app/(dashboard)/users/[id]/page.tsx` |
| Layout (side nav) | `src/app/(dashboard)/layout.tsx` |

Components: `users-table.tsx`, `user-detail-forms.tsx`, `dashboard-sidebar.tsx`.

## Server actions

File: `src/app/(dashboard)/users/actions.ts`

| Action | Input (Zod) | Calls | Side effects |
| --- | --- | --- | --- |
| `setUserRole` | `userId`, `role: admin \| user` | `requireAdmin()` → `auth.api.setRole` | revalidate `/users`, `/users/[id]`, `/audit`; audit `role_changed` |
| `resetUserPassword` | `userId`, `newPassword` (min 8) | `requireAdmin()` → `auth.api.setUserPassword` | same revalidate paths; audit `password_reset_by_admin` |

Reads:

- List: `auth.api.listUsers`
- Detail: `auth.api.getUser({ query: { id } })`

## Auth requirements

- `(dashboard)` layout calls `requireAdmin()` — non-admins redirect to `/`
- Each server action calls `requireAdmin()` again
- Better Auth admin plugin also enforces admin permissions on those APIs
- Admins cannot change their own role in the UI (`isSelf` disables the role form)

## Security notes

- Do not trust client-supplied role without Zod enum + server admin check
- Target `userId` is intentional for admin tooling; caller must be admin
- `proxy.ts` only checks cookie presence for `/users/*`

## QA

[docs/qa/user-management.test-cases.md](./qa/user-management.test-cases.md)
