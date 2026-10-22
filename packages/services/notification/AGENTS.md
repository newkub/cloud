---
name: '@wrikka/notification'
description: Notification infrastructure inspired by Novu
related:
  - follow-create-sdk
  - follow-lib-elysia
  - ship
---

## Goal

Build and maintain a working notification service without auth first.

## Scope

`packages/services/notification` workspace in the Bun + moonrepo monorepo.

## Execute

Run scripts from `packages/services/notification`:

| Script | Command |
|---|---|
| `dev` | `bun run dev` |
| `build` | `bun run build` |
| `typecheck` | `bun run typecheck` |
| `lint` | `bun run lint` |
| `test` | `bun run test` |
| `scan` | `bun run scan` |
| `check` | `bun run check` |
| `verify` | `bun run verify` |

### Architecture

| Tech | Skill |
|---|---|
| bun | `tech: /follow-lang-bun` |
| elysia | `tech: /follow-lib-elysia` |
| typescript | `tech: /follow-lang-typescript` |

### Skills

- follow-create-sdk
- follow-lib-elysia
- ship

### Workspaces

- No direct workspace dependencies.

## Rules

- Keep under 250 lines.
- No auth in v0.1.
- Persist via `bun:sqlite` in `SqliteStore` (`.data/notifications.sqlite`, override with `NOTIFICATION_DB_PATH`).
- Support web, mobile web, SDK, MCP, and skills.

## Expected Outcome

- Server runs and exposes notification API.
- Dashboard is accessible at `/`.
- SDK and MCP endpoints are documented and usable.
