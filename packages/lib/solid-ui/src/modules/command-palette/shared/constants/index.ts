/**
 * Shared Constants - Application-wide constants
 */

// Command palette constants
export const COMMAND_PALETTE_CONSTANTS = {
	// UI constants
	MAX_VISIBLE_COMMANDS: 10,
	MIN_SEARCH_LENGTH: 1,
	DEBOUNCE_DELAY_MS: 300,

	// Command limits
	MAX_COMMAND_TITLE_LENGTH: 100,
	MAX_COMMAND_DESCRIPTION_LENGTH: 500,
	MAX_KEYWORDS_PER_COMMAND: 10,

	// Performance
	SEARCH_TIMEOUT_MS: 5000,
	CACHE_TTL_MS: 300000, // 5 minutes

	// Storage keys
	STORAGE_PREFIX: "command_palette_",
	HISTORY_KEY: "command_history",
	SETTINGS_KEY: "command_settings",

	// Event names
	EVENTS: {
		COMMAND_EXECUTED: "command:executed",
		COMMAND_REGISTERED: "command:registered",
		COMMAND_UNREGISTERED: "command:unregistered",
		SEARCH_PERFORMED: "search:performed",
		PALETTE_OPENED: "palette:opened",
		PALETTE_CLOSED: "palette:closed",
	} as const,

	// Default categories
	DEFAULT_CATEGORIES: ["general", "navigation", "files", "edit", "view", "tools", "help"] as const,

	// Keyboard shortcuts
	KEYBOARD_SHORTCUTS: {
		TOGGLE_PALETTE: "cmd+k",
		NAVIGATE_UP: "arrowup",
		NAVIGATE_DOWN: "arrowdown",
		EXECUTE_COMMAND: "enter",
		CLOSE_PALETTE: "escape",
		CLEAR_SEARCH: "backspace",
	} as const,
} as const;

// Validation constants
export const VALIDATION_CONSTANTS = {
	// String validation
	MIN_STRING_LENGTH: 1,
	MAX_STRING_LENGTH: 1000,

	// ID validation
	ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
	MIN_ID_LENGTH: 1,
	MAX_ID_LENGTH: 50,

	// URL validation
	URL_PATTERN: /^https?:\/\/.+/,

	// Email validation
	EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Error messages
export const ERROR_MESSAGES = {
	// Domain errors
	COMMAND_NOT_FOUND: "Command not found",
	COMMAND_ALREADY_EXISTS: "Command already exists",
	INVALID_COMMAND_ACTION: "Invalid command action",

	// Application errors
	VALIDATION_FAILED: "Validation failed",
	UNAUTHORIZED: "Unauthorized action",
	USE_CASE_FAILED: "Use case execution failed",

	// Infrastructure errors
	DATABASE_ERROR: "Database operation failed",
	FILE_SYSTEM_ERROR: "File system operation failed",
	NETWORK_ERROR: "Network operation failed",
	CONFIGURATION_ERROR: "Configuration error",

	// Validation errors
	REQUIRED_FIELD: "Field is required",
	INVALID_FORMAT: "Invalid format",
	INVALID_LENGTH: "Invalid length",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
	COMMAND_REGISTERED: "Command registered successfully",
	COMMAND_EXECUTED: "Command executed successfully",
	COMMAND_UPDATED: "Command updated successfully",
	COMMAND_DELETED: "Command deleted successfully",
	SETTINGS_SAVED: "Settings saved successfully",
} as const;

// Default values
export const DEFAULT_VALUES = {
	COMMAND: {
		enabled: true,
		category: "general",
	},
	SEARCH: {
		limit: 10,
		offset: 0,
	},
	PAGINATION: {
		page: 1,
		limit: 20,
	},
} as const;
