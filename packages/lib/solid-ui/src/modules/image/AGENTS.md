---
name: @wrikka/image
description: Workspace @wrikka/image
related:
  - follow-create-devin-skills
  - follow-skills-map
  - improve-codebase
  - optimize-codebase
  - ask-me
---

## Goal

Agent guidance for the `@wrikka/image` workspace.

## Scope

This workspace lives in `packages/image` within the monorepo.

## Execute

Run the following scripts from `packages/image`:

| Script | Command |
|---|---|
| `dev` | `tsdown --watch` |
| `build` | `NODE_OPTIONS=--max-old-space-size=8192 tsdown` |
| `typecheck` | `tsgo --noEmit` |
| `lint` | `biome check src` |
| `format` | `biome format --write src` |
| `test` | `echo 'test skipped for image'` |
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

- `@wrikka/image` AGENTS.md is accurate and committed.
