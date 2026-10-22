/**
 * Preset Operations - Manage keyboard shortcut presets
 */

import type { Result } from "../../../shared/types";
import type { KeyboardShortcut, KeyboardState, ShortcutPreset } from "../../../types/ui/keyboard";
import { detectConflicts } from "./shortcut-operations";

// Apply preset
export const applyPreset = (state: KeyboardState, presetId: string): KeyboardState => {
	const preset = state.presets.find((p) => p.id === presetId);
	if (!preset) {
		return state;
	}

	const newState: KeyboardState = {
		...state,
		shortcuts: preset.shortcuts,
		conflicts: detectConflicts(preset.shortcuts),
		activePresetId: presetId,
	};

	return newState;
};

// Create preset
export const createPreset = (
	id: string,
	name: string,
	shortcuts: readonly KeyboardShortcut[],
	options?: Partial<ShortcutPreset>,
): Result<ShortcutPreset> => {
	if (!id || id.trim().length === 0) {
		return { success: false, error: new Error("Preset ID is required") };
	}

	if (!name || name.trim().length === 0) {
		return { success: false, error: new Error("Preset name is required") };
	}

	const preset: ShortcutPreset = {
		id: id.trim(),
		name: name.trim(),
		description: options?.description,
		shortcuts,
	};

	return { success: true, data: preset };
};
