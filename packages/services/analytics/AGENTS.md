---
name: '@wrikka/analytics'
description: Analytics module for the Wrikka cloud platform
related:
  - follow-monorepo
---

## Goal

Analytics module vendored inside the cloud platform monorepo.

## Scope

`packages/services/analytics` — clean-architecture analytics
module (`modules/` vertical slice, `adapters/`, `presentation/solid`,
`shared/`). Consumed by `apps/web` via the `#analytics/*` alias.

## Execute

Run scripts from `packages/services/analytics`:

| Script | Command |
|---|---|
| `typecheck` | `bun run typecheck` |
| `lint` | `bun run lint` |
| `test` | `bun run test` |
| `scan` | `bun run scan` |
| `check` | `bun run check` |
| `verify` | `bun run verify` |

### Architecture

| Tech | Skill |
|---|---|
| solid-js | `tech: /follow-framework-solidjs` |
| typescript | `tech: /follow-lang-typescript` |

## Rules

- Keep under 250 lines.
- No server/API — client-side tracking module.

## Expected Outcome

- `bun run check` and `bun run test` pass.
