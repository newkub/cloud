# @wrikka/solid-ui/command-palette

> 🚀 A Raycast-like command palette with Clean Architecture for SolidJS

A powerful command palette module inspired by Raycast, built with Clean Architecture principles. Features fuzzy search, keyboard shortcuts, command history, clipboard integration, and theme support.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![SolidJS](https://img.shields.io/badge/solidjs-1.9-44694D.svg)](https://solidjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Effect](https://img.shields.io/badge/effect-3.21-7F3ACE.svg)](https://effect.website/)

## Features

| Icon | Feature | Description |
|:----:|:--------|:------------|
| <center>![search](https://api.iconify.design/mdi:magnify.svg?color=%233498DB&width=16)</center> | Fuzzy Search | Fast fuzzy search with custom implementation |
| <center>![keyboard](https://api.iconify.design/mdi:keyboard.svg?color=%239B59B6&width=16)</center> | Keyboard Shortcuts | Customizable keyboard shortcuts |
| <center>![time](https://api.iconify.design/mdi:clock.svg?color=%23F39C12&width=16)</center> | Command History | Track and reuse recent commands |
| <center>![copy](https://api.iconify.design/mdi:content-copy.svg?color=%23E67E22&width=16)</center> | Clipboard Integration | Copy command results to clipboard |
| <center>![palette](https://api.iconify.design/mdi:palette.svg?color=%23E74C3C&width=16)</center> | Theme Support | Light and dark theme support |
| <center>![chip](https://api.iconify.design/mdi:chip.svg?color=%237F3ACE&width=16)</center> | Effect-Based | Built with Effect for type-safe operations |
| <center>![storage](https://api.iconify.design/mdi:database.svg?color=%2345B7D1&width=16)</center> | Local Storage | Persist commands and history |
| <center>![code](https://api.iconify.design/mdi:code-tags.svg?color=%2327AE60&width=16)</center> | Snippet Support | Store and execute code snippets |

## Get Started

1. **Install the module** — add @wrikka/solid-ui/command-palette to your project

   ```bash
   bun add @wrikka/solid-ui/command-palette
   ```

2. **Wrap your app** — add the CommandPaletteProvider

   ```tsx
   import { CommandPaletteProvider } from '@wrikka/solid-ui/command-palette'

   function App() {
     return (
       <CommandPaletteProvider config={{ keyboardShortcut: 'Cmd+K', theme: 'dark' }}>
         <YourApp />
       </CommandPaletteProvider>
     )
   }
   ```

3. **Use the composable** — register commands and control the palette

   ```tsx
   import { useCommandPalette } from '@wrikka/solid-ui/command-palette'

   function MyComponent() {
     const { open, registerCommand } = useCommandPalette()
     registerCommand({
       id: 'create-project', title: 'Create New Project', icon: 'carbon:add',
       action: () => console.log('Creating project...'),
     })
     return <button onClick={open}>Open Command Palette (Cmd+K)</button>
   }
   ```

## Usage

### Registering Commands

```typescript
import { registerCommand } from '@wrikka/solid-ui/command-palette'

// Simple command
registerCommand({
  id: 'open-settings', title: 'Open Settings', icon: 'carbon:settings',
  action: () => navigateTo('/settings'),
})

// Command with subcommands
registerCommand({
  id: 'file', title: 'File', icon: 'carbon:document',
  subcommands: [
    { id: 'file-new', title: 'New File', action: () => createNewFile() },
    { id: 'file-open', title: 'Open File', action: () => openFile() },
  ],
})

// Command with parameters
registerCommand({
  id: 'search', title: 'Search', icon: 'carbon:search',
  action: (query: string) => performSearch(query),
})
```

### Using the Composable

```tsx
import { useCommandPalette } from '@wrikka/solid-ui/command-palette'

function MyComponent() {
  const { open, close, toggle, isOpen, executeCommand, searchCommands } = useCommandPalette()
  return (
    <div>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}
```

### Keyboard Shortcuts

```typescript
import { configureKeyboardShortcuts } from '@wrikka/solid-ui/command-palette'

configureKeyboardShortcuts({
  open: 'Cmd+K', close: 'Escape',
  navigateUp: 'ArrowUp', navigateDown: 'ArrowDown', execute: 'Enter',
})
```

### Command History

```typescript
import { getCommandHistory, clearHistory } from '@wrikka/solid-ui/command-palette'

const history = await getCommandHistory()
await clearHistory()
```

### Clipboard Integration

```typescript
import { copyToClipboard, pasteFromClipboard } from '@wrikka/solid-ui/command-palette'

registerCommand({
  id: 'copy-result', title: 'Copy Result',
  action: async () => { const result = await fetchData(); await copyToClipboard(result) },
})
```

### Theme Configuration

```tsx
import { CommandPaletteProvider } from '@wrikka/solid-ui/command-palette'

function App() {
  return (
    <CommandPaletteProvider
      config={{
        theme: 'dark',
        customTheme: { background: '#1a1a1a', foreground: '#ffffff', accent: '#3B82F6' },
      }}
    >
      <YourApp />
    </CommandPaletteProvider>
  )
}
```

### Snippet Management

```typescript
import { saveSnippet, getSnippets, deleteSnippet } from '@wrikka/solid-ui/command-palette'

await saveSnippet({ id: 'react-component', title: 'React Component', code: '...', language: 'typescript' })
const snippets = await getSnippets()
await deleteSnippet('react-component')
```

## License

This project is licensed under the <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="noopener noreferrer">MIT License</a>.

- ✓ Commercial use, Distribution, Modification, Private use
- ⓘ License and copyright notice
- ✕ Liability, Warranty
