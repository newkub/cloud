/**
 * KeyboardShortcutConfig - Keyboard shortcut configuration
 */

import type { KeyboardShortcut } from "../../types";

const createShortcut = (
	id: string,
	key: string,
	modifiers: readonly ("ctrl" | "alt" | "shift" | "meta")[],
	action: string,
): KeyboardShortcut => ({
	id,
	commandId: id,
	keys: [key, ...modifiers],
	description: action,
	enabled: true,
	isDefault: true,
});

export interface KeyboardShortcutConfig {
	readonly openPalette: KeyboardShortcut;
	readonly closePalette: KeyboardShortcut;
	readonly navigateUp: KeyboardShortcut;
	readonly navigateDown: KeyboardShortcut;
	readonly executeCommand: KeyboardShortcut;
}

export const defaultKeyboardShortcutConfig: KeyboardShortcutConfig = {
	openPalette: createShortcut("open-palette", "k", ["meta"], "open"),
	closePalette: createShortcut("close-palette", "escape", [], "close"),
	navigateUp: createShortcut("navigate-up", "arrowup", [], "navigate"),
	navigateDown: createShortcut("navigate-down", "arrowdown", [], "navigate"),
	executeCommand: createShortcut("execute-command", "enter", [], "execute"),
};
