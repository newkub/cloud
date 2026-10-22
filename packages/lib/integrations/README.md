> ![Status](https://img.shields.io/badge/status-active-brightgreen)

# @wrikka/integrations

Integration adapters for Wrikka — typed client ports for Stripe, GitHub,
Supabase, and Cloudflare built on Clean Architecture: each module defines a
`Port` interface plus a REST adapter factory, so callers depend on contracts,
not vendor SDKs.

Source: [github.com/newkub/cloud](https://github.com/newkub/cloud) — `packages/lib/integrations`

![Bun](https://img.shields.io/badge/Bun-%3E%3D1.0-fbf0df)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Architecture](https://img.shields.io/badge/architecture-ports%20%26%20adapters-7b1fa2)

```text
┌──────────────────────────────────────────────────────────┐
│  integrations — config in, typed port out                │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │  Config    │─▶│  Factory   │─▶│   Port     │          │
│  │ {token…}   │  │ create*()  │  │ interface  │          │
│  └────────────┘  └────────────┘  └─────┬──────┘          │
│                                       ▼                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐          │
│  │  Typed     │◀─│  REST      │◀─│  Vendor    │          │
│  │  results   │  │  adapter   │  │  HTTP API  │          │
│  └────────────┘  └────────────┘  └────────────┘          │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Install — from the workspace or registry

   ```bash
   bun add @wrikka/integrations
   ```

2. Create a client — each module ships a factory

   ```typescript
   import { github } from "@wrikka/integrations";

   const gh = github.createGitHubClient({ token: process.env.GH_TOKEN! });
   const repo = await gh.getRepository("newkub", "cloud");
   ```

3. Depend on the port — inject `GitHubClientPort` (or any `*Port`) in app
   code; swap adapters or fakes without touching call sites

## Features

|                        Icon                         | Feature | Description | Benefit | Usage |
| :-------------------------------------------------: | ------- | ----------- | ------- | ----- |
|  ![gh](https://api.iconify.design/mdi:github.svg?color=%23303f9f&width=16)  | GitHub | `GitHubClientPort` — repository + issue reads | Typed REST, no octokit dep | `github.createGitHubClient({token})` |
| ![stripe](https://api.iconify.design/mdi:credit-card-outline.svg?color=%23388e3c&width=16) | Stripe | `StripeClientPort` — checkout sessions, payment intents, customer/invoice repos | Billing flows behind a contract | `stripe.createStripeClient({secretKey})` |
| ![cf](https://api.iconify.design/mdi:cloud-outline.svg?color=%23f57c00&width=16) | Cloudflare | `CloudflareClientPort` — zone listing + lookup | Edge config via one port | `cloudflare.createCloudflareClient({token})` |
| ![sb](https://api.iconify.design/mdi:database-outline.svg?color=%2300796b&width=16) | Supabase | `SupabaseClientPort` — `from(table).select()` query builder | PostgREST without the SDK | `supabase.createSupabaseClient({url, key})` |
| ![hex](https://api.iconify.design/mdi:hexagon-slice-6.svg?color=%23c2185b&width=16) | Ports & adapters | Every vendor behind an interface | Fakes for tests, zero vendor lock | `import type { *Port }` |

## Usage

### Usage via Library API

```typescript
import { cloudflare, github, stripe, supabase } from "@wrikka/integrations";

// GitHub — repositories + issues
const gh = github.createGitHubClient({ token: "ghp_…" });
const issues = await gh.listIssues("newkub", "cloud", "open");

// Stripe — checkout + payment intents
const billing = stripe.createStripeClient({ secretKey: "sk_…" });
const session = await billing.createCheckoutSession({
	line_items: [{ price: "price_…", quantity: 1 }],
	mode: "payment",
	success_url: "https://app.example/ok",
	cancel_url: "https://app.example/cancel",
});

// Cloudflare — zones
const cf = cloudflare.createCloudflareClient({ token: "…" });
const zones = await cf.listZones();

// Supabase — query builder
const db = supabase.createSupabaseClient({ url: "…", key: "…" });
const rows = await db.from("users").select();
```

| api | description | options | default |
| --- | ----------- | ------- | ------- |
| `github.createGitHubClient` | REST client for repos + issues | `{ token, baseUrl? }` | `api.github.com` |
| `stripe.createStripeClient` | Checkout sessions + payment intents | `{ secretKey, baseUrl? }` | `api.stripe.com` |
| `cloudflare.createCloudflareClient` | Zone list + get | `{ token }` | — |
| `supabase.createSupabaseClient` | `from(table).select()` builder | `{ url, key }` | — |
