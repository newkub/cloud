/**
 * Keyboard Operations - Domain operations for keyboard shortcut customization
 */

// Preset operations
export { applyPreset, createPreset } from "./preset-operations";
// Shortcut operations
export {
	addShortcut,
	createKeyboardShortcut,
	detectConflicts,
	removeShortcut,
	resetToDefaults,
	updateShortcut,
} from "./shortcut-operations";
