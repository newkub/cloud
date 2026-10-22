# @wrikka/notification

Notification infrastructure inspired by [Novu](https://novu.co/).
No authentication yet — working app first.

## Features

- **Web**: responsive dashboard at `http://localhost:3000`
- **Mobile**: dashboard is mobile-ready via responsive web
- **SDK**: TypeScript client in `src/sdk/index.ts`
- **MCP**: JSON-RPC MCP endpoint at `POST /mcp`
- **Skills**: client factory in `src/adapters/skills/`
- **API**: SQLite-backed notification/subscriber/trigger service

## Scripts

- `bun run dev` — start server on `PORT` (default 3000)
- `bun run build` — build with `bun build`
- `bun run typecheck` — `tsc --noEmit`
- `bun run test` — `vitest`
- `bun run verify` — full verify

## API

- `GET /health`
- `GET /api/notifications`
- `POST /api/notifications`
- `GET /api/subscribers`
- `POST /api/subscribers`
- `POST /api/trigger`
- `POST /mcp`

## Architecture

Clean Architecture:

- `src/domain` — entities and repository interfaces
- `src/application` — use cases
- `src/adapters` — Elysia HTTP, `bun:sqlite` DB (`.data/notifications.sqlite`), MCP, skills
- `src/presentation` — web dashboard and mobile entry
- `src/sdk` — public SDK

## Stack

- Bun
- Elysia
- TypeScript
