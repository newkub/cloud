> ![Status](https://img.shields.io/badge/status-active-brightgreen)

# @wrikka/hooks

SolidJS reactive hooks library — 343 hooks covering signals, DOM observers, browser APIs, async flows and state utilities.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-1976d2) ![SolidJS](https://img.shields.io/badge/SolidJS-1.9-1c6fbb) ![Bun](https://img.shields.io/badge/Bun-1.4-f57c00)

```text
┌────────────────────────────────────────────────────── │
│  browser API / event ──▶ useX hook ──▶ Accessor<T>    │
│                                                       │
│  src/useX.ts ──▶ index.ts barrel ──▶ consumer app     │
└────────────────────────────────────────────────────── │
```

## Get Started

1. Install the package in a SolidJS project
   ```bash
   bun add @wrikka/hooks
   ```
2. Type-check the workspace
   ```bash
   bun run typecheck
   ```
3. Run tests
   ```bash
   bun run test
   ```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:hook.svg?color=%23388e3c&width=16) | 343 hooks | Signals, lists, observers, media, network, speech, storage | One import surface for reactive logic | `import { useList } from "@wrikka/hooks"` |
| ![icon](https://api.iconify.design/mdi:eye.svg?color=%231976d2&width=16) | DOM Observers | Intersection, resize, measure, scroll-snap hooks | Declarative DOM observation | `useIntersection()` |
| ![icon](https://api.iconify.design/mdi:database.svg?color=%23f57c00&width=16) | State Utilities | Store, list ops, parallel async helpers | Predictable state handling | `useStore()`, `useListOps()` |

## Usage

### Usage via Package

```ts
import { useIntersection, useList, useMeasure, useStore } from "@wrikka/hooks";
```

| api | description | options | default |
|-----|-------------|---------|---------|
| `useList<T>(initial)` | Reactive list helpers | `initial: T[]` | `[]` |
| `useIntersection(ref, cb)` | IntersectionObserver binding | `threshold`, `root` | viewport |
| `useMeasure(ref)` | Element rect via ResizeObserver | — | — |
| `useStore(initial)` | Small reactive store | `initial` object | — |
