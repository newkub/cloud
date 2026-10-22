/**
 * Command Palette Module - Clean Architecture
 *
 * A Raycast-like command palette for SolidJS applications
 *
 * Structure:
 * - modules/command-palette/ - Domain module
 *   - types/                 - Domain types
 *   - domain/                - Pure business logic
 *   - application/           - Orchestration layer
 *   - ports/                 - Interface definitions
 * - adapters/                - External system integrations
 * - presentation/            - Entry points
 * - shared/                  - Shared kernel
 */

// Adapters - specific exports to avoid conflicts
export {
	createCommandRepository,
	createMemoryCommandRepository,
} from "./adapters/db/memory-command-repository";
export {
	createCustomCommandSearcher,
	searchWithCustom,
} from "./adapters/search/fuse-command-searcher";
export * from "./application/usecases/category";
export * from "./application/usecases/command";
export * from "./application/usecases/history";
// Application layer exports
export {
	quickSearchUseCase,
	searchCommandsMainUseCase,
	searchCommandsPaginatedUseCase,
	searchCommandsUseCase,
} from "./application/usecases/search";
export * from "./application/usecases/workflow";

// Domain layer exports
export {
	COMMAND_LABEL_MAX_LENGTH,
	DEFAULT_HISTORY_LIMIT,
	DEFAULT_MAX_RESULTS,
	DEFAULT_SEARCH_THRESHOLD,
} from "./domain/constants";
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
} from "./domain/events/command-events";
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
} from "./domain/models/command";
export * from "./domain/operations";

// Ports exports
export * from "./ports";
export { useClipboard, useSnippets } from "./presentation/solid/composables";
// Presentation layer exports (SolidJS specific)
export {
	CommandPaletteProvider,
	useCommandPalette,
} from "./presentation/solid/module";
// Types exports
export * from "./types/command";
export type {
	ClipboardEntry,
	ClipboardHistory,
} from "./types/integration/clipboard";
export {
	addClipboardEntry,
	createClipboardHistory,
	getRecentClipboardEntries,
} from "./types/integration/clipboard";
export type { CommandHistoryEntry } from "./types/integration/history";
export type {
	CommandHistory,
	CommandLabel,
	Theme,
	ThemeType,
} from "./types/integration/value-objects";
export {
	createTheme,
	isDarkTheme,
	isSystemTheme,
	themeToString,
} from "./types/integration/value-objects";
export * from "./types/search";
export * from "./types/ui";
// Remove shared exports to avoid duplicate export conflicts
// export * from "./shared";
