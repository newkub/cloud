# Wrikka Cloud

Monorepo for the Wrikka cloud platform.

## Layout

| Path | Description |
| --- | --- |
| `apps/ci` | Cloudflare CI Worker (build/heal pipelines, sandbox containers) and its dashboard |
| `apps/web` | Cloud platform dashboard (SolidJS + TanStack Router) |
| `apps/cli` | Cloud platform CLI |
| `packages/services/analytics` | Analytics module |
| `packages/services/notification` | Notification infrastructure (Elysia + TypeBox) |
| `packages/lib/integrations` | Integration adapters (Stripe, GitHub, Supabase, Cloudflare) |
| `packages/lib/solid-ui` | SolidJS component library (prebuilt `dist`, vendored) |
| `packages/lib/animation` | Animation engine and Solid adapters (vendored) |
| `packages/lib/chart` | Chart engine and Solid renderers (vendored) |
| `packages/lib/hooks` | SolidJS hooks (vendored) |

## Commands

```sh
bun install
bun run dev            # dashboard dev server
bun run dev:ci         # CI Worker dev server
bun run build          # build dashboard + CI Worker (dry-run deploy)
bun run typecheck      # typecheck dashboard + CI Worker
bun run typecheck:services
```

`apps/ci` deploys with Wrangler; the Worker name and Artifacts/R2 resources remain `cloud-ci`.
