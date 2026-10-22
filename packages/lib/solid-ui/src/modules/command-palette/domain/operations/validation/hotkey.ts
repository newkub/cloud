/**
 * Validate Command Hotkey - Single responsibility for hotkey validation
 * Pure function for validating command hotkeys only
 */

import type { Result } from "../../../shared/types";

export const validateCommandHotkey = (hotkey: string): Result<string> => {
	// Validate not empty
	if (!hotkey || hotkey.trim().length === 0) {
		return {
			success: false,
			error: new Error("Hotkey cannot be empty"),
		};
	}

	// Validate format (basic check for cmd+k, ctrl+shift+a patterns)
	const hotkeyPattern = /^[a-zA-Z0-9+_-]+$/;
	if (!hotkeyPattern.test(hotkey)) {
		return {
			success: false,
			error: new Error('Invalid hotkey format. Use format like "cmd+k" or "ctrl+shift+a"'),
		};
	}

	// Validate length
	if (hotkey.length > 20) {
		return {
			success: false,
			error: new Error("Hotkey must be 20 characters or less"),
		};
	}

	return { success: true, data: hotkey };
};
