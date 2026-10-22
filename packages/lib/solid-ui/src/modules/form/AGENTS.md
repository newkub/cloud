---
name: @wrikka/form
description: Workspace @wrikka/form
related:
  - follow-create-devin-skills
  - follow-skills-map
  - improve-codebase
  - optimize-codebase
  - ask-me
---

## Goal

Agent guidance for the `@wrikka/form` workspace.

## Scope

This workspace lives in `packages/form` within the monorepo.

## Execute

Run the following scripts from `packages/form`:

| Script | Command |
|---|---|
| `dev` | `tsdown --watch` |
| `build` | `tsdown` |
| `typecheck` | `tsgo --noEmit` |
| `lint` | `biome check src` |
| `format` | `biome format --write src` |
| `test` | `echo 'test skipped for form'` |
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

- `@wrikka/form` AGENTS.md is accurate and committed.
