---
name: @wrikka/command-palette
description: A Raycast-like command palette with Clean Architecture for SolidJS
related:
  - follow-create-devin-skills
  - follow-skills-map
  - improve-codebase
  - optimize-codebase
  - ask-me
---

## Goal

Agent guidance for the `@wrikka/command-palette` workspace.

## Scope

This workspace lives in `packages/command-palette` within the monorepo.

## Execute

Run the following scripts from `packages/command-palette`:

| Script | Command |
|---|---|
| `dev` | `bun run src/index.ts` |
| `build` | `tsdown` |
| `typecheck` | `tsc --noEmit` |
| `lint` | `biome check` |
| `format` | `biome check --write` |
| `test` | `vitest run` |
| `scan` | `ast-grep scan` |
| `verify` | `bun run scan && bun run lint && bun run typecheck && bun run test` |
| `ci` | `bun run verify && bun run build` |

Moon tasks: `build, ci, dev, format, lint, scan, test, typecheck, verify`

### Architecture

| Tech | Skill |
|---|---|
| solidjs | `tech: /follow-solidjs` |

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

- `@wrikka/command-palette` AGENTS.md is accurate and committed.
