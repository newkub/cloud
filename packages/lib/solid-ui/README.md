> ![Status](https://img.shields.io/badge/status-active-brightgreen)

# @wrikka/solid-ui

Solid UI component library — 978 production-ready, accessible SolidJS components styled with UnoCSS semantic tokens.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-1976d2) ![SolidJS](https://img.shields.io/badge/SolidJS-1.9-1c6fbb) ![Bun](https://img.shields.io/badge/Bun-1.4-f57c00)

```text
┌────────────────────────────────────────────────────── │
│  src/components ──▶ registry.ts (978 components)      │
│         │                                             │
│         ▼                                             │
│  tsdown build ──▶ dist/index.mjs + dist/registry.mjs  │
│         │                                             │
│         ▼                                             │
│  consumers: website, CLI registry, MCP server         │
└────────────────────────────────────────────────────── │
```

## Get Started

1. Install the package in a SolidJS project
   ```bash
   bun add @wrikka/solid-ui
   ```
2. Build the package for distribution
   ```bash
   bun run build
   ```
3. Run Storybook for component development
   ```bash
   bun run storybook
   ```
4. Regenerate the registry after adding components
   ```bash
   bun run gen:registry
   ```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:puzzle.svg?color=%231976d2&width=16) | 978 Components | Inputs, overlays, navigation, data display, charts and blocks | Covers app surfaces end-to-end | `import { Button } from "@wrikka/solid-ui"` |
| ![icon](https://api.iconify.design/mdi:file-tree.svg?color=%23388e3c&width=16) | Registry | Every component indexed in `registry.ts` with name, tag, description | Powers CLI `add` and MCP discovery | `@wrikka/solid-ui/registry` |
| ![icon](https://api.iconify.design/mdi:palette.svg?color=%23f57c00&width=16) | Semantic Tokens | UnoCSS theme tokens (`bg-background`, `text-foreground`, `border-border`) | Dark mode and theming for free | `bun run unocss-theme-validator` |
| ![icon](https://api.iconify.design/mdi:book-open.svg?color=%237b1fa2&width=16) | Storybook | Component stories and preview harness | Visual development and review | `bun run storybook` |

## Usage

### Usage via Package

```ts
import { Accordion, Button, Dialog } from "@wrikka/solid-ui";
import { registry } from "@wrikka/solid-ui/registry";
```

| api | description | options | default |
|-----|-------------|---------|---------|
| `@wrikka/solid-ui` | All 978 components | props extend `JSX.HTMLAttributes` | — |
| `@wrikka/solid-ui/registry` | Component metadata list | `name`, `tag`, `description` | — |
| `@wrikka/solid-ui/command-palette` | Command palette module | — | — |
