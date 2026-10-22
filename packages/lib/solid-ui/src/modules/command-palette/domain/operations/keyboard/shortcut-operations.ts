/**
 * Shortcut Operations - Create and manage keyboard shortcuts
 */

import type { Result } from "../../../shared/types";
import type { KeyboardShortcut, KeyboardState, ShortcutConflict } from "../../../types/ui/keyboard";

// Create keyboard shortcut
export const createKeyboardShortcut = (
	id: string,
	commandId: string,
	keys: readonly string[],
	options?: Partial<KeyboardShortcut>,
): Result<KeyboardShortcut> => {
	if (!id || id.trim().length === 0) {
		return { success: false, error: new Error("Shortcut ID is required") };
	}

	if (!commandId || commandId.trim().length === 0) {
		return { success: false, error: new Error("Command ID is required") };
	}

	if (!keys || keys.length === 0) {
		return { success: false, error: new Error("Keys are required") };
	}

	const shortcut: KeyboardShortcut = {
		id: id.trim(),
		commandId: commandId.trim(),
		keys,
		description: options?.description,
		enabled: options?.enabled ?? true,
		isDefault: options?.isDefault ?? false,
	};

	return { success: true, data: shortcut };
};

// Detect conflicts
export const detectConflicts = (shortcuts: readonly KeyboardShortcut[]): readonly ShortcutConflict[] => {
	const conflicts: ShortcutConflict[] = [];
	const keyMap = new Map<string, readonly string[]>();

	// Build key map
	for (const shortcut of shortcuts) {
		if (!shortcut.enabled) continue;

		const keyString = shortcut.keys.join("+");
		const existing = keyMap.get(keyString) || [];
		keyMap.set(keyString, [...existing, shortcut.commandId]);
	}

	// Find conflicts
	for (const [keyString, commandIds] of keyMap.entries()) {
		if (commandIds.length > 1) {
			conflicts.push({
				shortcutId: `conflict-${keyString}`,
				conflictingCommandIds: commandIds,
				keys: keyString.split("+"),
			});
		}
	}

	return conflicts;
};

// Update shortcut
export const updateShortcut = (
	state: KeyboardState,
	shortcutId: string,
	updates: Partial<KeyboardShortcut>,
): KeyboardState => {
	const updatedShortcuts = state.shortcuts.map((s) => (s.id === shortcutId ? { ...s, ...updates } : s));

	const newState: KeyboardState = {
		...state,
		shortcuts: updatedShortcuts,
		conflicts: detectConflicts(updatedShortcuts),
	};

	return newState;
};

// Add shortcut
export const addShortcut = (state: KeyboardState, shortcut: KeyboardShortcut): KeyboardState => {
	const updatedShortcuts = [...state.shortcuts, shortcut];

	const newState: KeyboardState = {
		...state,
		shortcuts: updatedShortcuts,
		conflicts: detectConflicts(updatedShortcuts),
	};

	return newState;
};

// Remove shortcut
export const removeShortcut = (state: KeyboardState, shortcutId: string): KeyboardState => {
	const updatedShortcuts = state.shortcuts.filter((s) => s.id !== shortcutId);

	const newState: KeyboardState = {
		...state,
		shortcuts: updatedShortcuts,
		conflicts: detectConflicts(updatedShortcuts),
	};

	return newState;
};

// Reset to default shortcuts
export const resetToDefaults = (state: KeyboardState): KeyboardState => {
	const defaultShortcuts = state.shortcuts.filter((s) => s.isDefault);

	const newState: KeyboardState = {
		...state,
		shortcuts: defaultShortcuts,
		conflicts: detectConflicts(defaultShortcuts),
	};

	return newState;
};
