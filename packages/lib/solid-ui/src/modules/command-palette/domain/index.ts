/**
 * Command Palette Domain - Pure business logic
 * No external dependencies, pure functions only
 */

export {
	COMMAND_LABEL_MAX_LENGTH,
	DEFAULT_HISTORY_LIMIT,
	DEFAULT_MAX_RESULTS,
	DEFAULT_SEARCH_THRESHOLD,
} from "./constants";
export {
	createCommandCategoryChangedEvent,
	createCommandCreatedEvent,
	createCommandDeletedEvent,
	createCommandDisabledEvent,
	createCommandEnabledEvent,
	createCommandExecutedEvent,
	createCommandHotkeyChangedEvent,
	createCommandSearchedEvent,
	createCommandUpdatedEvent,
} from "./events/command-events";
export {
	commandHasHotkey,
	commandMatchesCategory,
	commandMatchesQuery,
	compareCommandsByCreatedAt,
	compareCommandsByLabel,
	compareCommandsByUpdatedAt,
	createCommand,
	disableCommand,
	enableCommand,
	isCommandEnabled,
	isCommandInCategory,
	toggleCommand,
	updateCommand,
	validateCommand,
} from "./models/command";
export * from "./operations";
