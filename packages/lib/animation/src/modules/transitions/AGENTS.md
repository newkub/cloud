---
name: @wrikka/transitions
description: Workspace @wrikka/transitions
related:
  - follow-create-devin-skills
  - follow-skills-map
  - improve-codebase
  - optimize-codebase
  - ask-me
---

## Goal

Agent guidance for the `@wrikka/transitions` workspace.

## Scope

This workspace lives in `packages/transitions` within the monorepo.

## Execute

Run the following scripts from `packages/transitions`:

| Script | Command |
|---|---|
| `dev` | `tsdown --watch` |
| `build` | `tsdown` |
| `typecheck` | `tsgo --noEmit` |
| `lint` | `biome check src` |
| `format` | `biome format --write src` |
| `test` | `echo 'test skipped for transitions'` |
| `scan` | `ast-grep scan` |
| `verify` | `bun run scan && bun run lint && bun run typecheck && bun run test` |
| `ci` | `bun run verify && bun run build` |

### Architecture

| Tech | Skill |
|---|---|
| arktype | `tech: /follow-arktype` |
| solidjs | `tech: /follow-solidjs` |
| tsdown | `tech: /follow-tsdown` |
| typescript | `tech: /follow-typescript` |

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

- `@wrikka/transitions` AGENTS.md is accurate and committed.
