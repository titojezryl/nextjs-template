# Docs index

Project documentation for the Next.js auth template.

## Architecture

- [architecture.md](./architecture.md) — layers, auth model, request flow

## Features

- [authentication.md](./authentication.md) — login, signup, Google SSO, password reset
- [user-management.md](./user-management.md) — admin `/users` and `/users/[id]`
- [audit-trail.md](./audit-trail.md) — audit log writes and `/audit` UI
- [landing-and-authorization.md](./landing-and-authorization.md) — role-gated landing/header UX

## QA

- [qa/authentication.test-cases.md](./qa/authentication.test-cases.md)
- [qa/user-management.test-cases.md](./qa/user-management.test-cases.md)
- [qa/audit-trail.test-cases.md](./qa/audit-trail.test-cases.md)

## Agent workflow

When changing features, follow `.cursor/skills/feature-workflow/SKILL.md`:

1. Implement with server-side auth
2. Update feature docs + QA cases
3. Run `pnpm verify` (typecheck, lint, test, build) and fix failures
