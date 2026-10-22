// Domain Operations - Pure business logic operations with Single Responsibility Principle

export {
	addAnnouncement,
	clearAnnouncements,
	createAnnouncementQueue,
	createAriaAttributes,
	createFocusState,
	createKeyboardNavigation,
	getLatestAnnouncement,
	moveFocus,
} from "./accessibility";
// Feature-based operations
export {
	buildAISearchRequest,
	calculateRelevanceScore,
	filterSuggestionsByConfidence,
	performAISearch,
	processAISearchResponse,
	sortSuggestionsByRelevance,
} from "./ai";
export {
	type AnalyticsEvent,
	type AnalyticsStats,
	calculatePopularityScore,
	getFrequentlyUsedCommands,
	getMostUsedCommands,
	getRecentlyUsedCommands,
	getUnusedCommands,
	getUsageStats,
	getUsageTrend,
	sortCommandsByPopularity,
	trackExecution,
} from "./analytics";
export * from "./category";
export {
	createSyncData,
	createSyncResult,
	createSyncStatus,
	detectConflicts as detectSyncConflicts,
	mergeSyncData,
	resolveConflict,
} from "./cloud-sync";
// Core operations
export * from "./command";
export {
	createInitialContext,
	type DomainCommandContext,
	type DomainContextualCommand,
	filterCommandsByContext,
	getContextualCommands,
	matchCommandContext,
	matchCommandWithContext,
	updateContext,
} from "./context";
export * from "./favorites";
export {
	filterCommandsByCategory as filterCommandsByGrouping,
	getCommandCategory,
	getCommandsWithCategory,
	getCommandsWithoutCategory,
	getUniqueCategories,
	groupCommandsByCategory,
	isCommandInCategory,
	sortGroupsByCount,
	sortGroupsByName,
} from "./grouping";
export {
	addShortcut,
	applyPreset,
	createKeyboardShortcut,
	createPreset,
	detectConflicts,
	removeShortcut,
	resetToDefaults,
	updateShortcut,
} from "./keyboard";
export {
	createInitialNavigationState,
	getBreadcrumbs,
	hasSubcommands,
	isAtRoot,
	navigateToParent,
	navigateToRoot,
	navigateToSubcommands,
} from "./navigation";
export {
	clearCache,
	createCacheState,
	createDebounce,
	createThrottle,
	getFromCache,
	memoizeSearch,
	setToCache,
} from "./performance";
export {
	checkPluginPermissions,
	createPlugin,
	disablePlugin,
	enablePlugin,
	getAllEnabledPluginCommands,
	getPluginCommands,
	registerPlugin,
	unregisterPlugin,
	validatePluginDependencies,
} from "./plugin";
export * from "./rating";
export * from "./search";
export * from "./sharing";
export * from "./suggestions";
// Validation operations
export * from "./validation";
export {
	evaluateCondition,
	executeWorkflow,
	executeWorkflowStep,
} from "./workflow";
