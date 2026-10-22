/**
 * Keyboard Types - Domain types for keyboard shortcut customization
 */

// Keyboard shortcut types
export interface KeyboardShortcut {
	readonly id: string;
	readonly commandId: string;
	readonly keys: readonly string[]; // e.g., ["cmd", "k"]
	readonly description?: string;
	readonly enabled: boolean;
	readonly isDefault: boolean;
}

export interface ShortcutConflict {
	readonly shortcutId: string;
	readonly conflictingCommandIds: readonly string[];
	readonly keys: readonly string[];
}

export interface ShortcutPreset {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly shortcuts: readonly KeyboardShortcut[];
}

// Keyboard state
export interface KeyboardState {
	readonly shortcuts: readonly KeyboardShortcut[];
	readonly conflicts: readonly ShortcutConflict[];
	readonly presets: readonly ShortcutPreset[];
	readonly activePresetId?: string;
}
