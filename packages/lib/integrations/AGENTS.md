---
name: @wrikka/integrations
description: Integration adapters for Wrikka (Stripe, GitHub, Supabase, Cloudflare)
related:
  - follow-create-devin-skills
  - follow-skills-map
  - improve-codebase
  - optimize-codebase
  - ask-me
---

## Goal

Agent guidance for the `@wrikka/integrations` workspace.

## Scope

This workspace lives in `packages/lib/integrations` within the monorepo.

## Execute

Run the following scripts from `packages/lib/integrations`:

| Script | Command |
|---|---|
| `dev` | `bun run src/index.ts` |
| `build` | `bunup` |
| `build:watch` | `bunup --watch` |
| `typecheck` | `bunx tsc --noEmit` |
| `typecheck:watch` | `bunx tsc --noEmit --watch` |
| `lint` | `biome check` |
| `lint:fix` | `biome check --write` |
| `format` | `biome check --write` |
| `test` | `vitest run` |
| `test:watch` | `vitest` |
| `test:coverage` | `vitest run --coverage` |
| `scan` | `bunx ast-grep scan` |
| `check` | `bun run lint && bun run typecheck && bun run scan` |
| `verify` | `bun run check && bun run test && bun run build` |
| `deps:analyze` | `bunx depcheck` |
| `clean` | `bunx rimraf node_modules dist` |

### Architecture

| Tech | Skill |
|---|---|
| solidjs | `tech: /follow-solidjs` |
| biome | `tech: /follow-biome` |
| typescript | `tech: /follow-typescript` |
| bunup | `tech: /follow-bunup` |
| vitest | `tech: /follow-vitest` |

### Skills

- follow-create-devin-skills
- follow-skills-map
- improve-codebase
- optimize-codebase
- ask-me

### Workspaces

- No direct workspace dependencies.

## Rules

- Keep under 250 lines.
- Map tech stack with `tech: /follow-<skill>`.
- Map workspace dependencies in `uses:`.
- Do not duplicate root conventions.

## Expected Outcome

- `@wrikka/integrations` AGENTS.md is accurate and committed.
