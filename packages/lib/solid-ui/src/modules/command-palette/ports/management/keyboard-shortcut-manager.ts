/**
 * Keyboard Shortcut Manager Port - Interface for keyboard shortcut management
 */

import type { KeyboardShortcut } from "../../types/ui/keyboard";

export interface KeyboardShortcutManager {
	registerShortcut(action: string, shortcut: KeyboardShortcut): void;
	unregisterShortcut(action: string): void;
	getShortcut(action: string): KeyboardShortcut | null;
	executeShortcut(action: string): void;
}
