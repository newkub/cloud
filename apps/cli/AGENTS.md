---
name: '@wrikka/cloud-cli'
description: Wrikka cloud platform CLI
related:
  - follow-monorepo
---

## Goal

CLI entrypoint for the Wrikka cloud platform (`D:product-saasoud`).

## Scope

`apps/cli` workspace in the Bun + moonrepo monorepo.

## Execute

Run scripts from `apps/cli`:

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
| typescript | `tech: /follow-lang-typescript` |

### Workspaces

- `packages/services/*` — platform services the CLI manages.

## Rules

- Keep under 250 lines.
- Bun-native APIs only (`Bun.argv`, `Bun.spawn`).

## Expected Outcome

- `bun run dev` prints help and dispatches commands.
