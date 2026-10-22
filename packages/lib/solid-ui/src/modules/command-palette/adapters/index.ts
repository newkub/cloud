/**
 * Adapters Layer - External systems integration
 * Database, HTTP, external services, and configuration
 */

export * from "./config";
export * from "./db";
export {
	createDIContainer,
	getClipboardStorage,
	getCommandRepository,
	getCommandSearcher,
	getDefaultContainer,
	getEventDispatcher,
	getSnippetStorage,
	getStorage,
	resetDefaultContainer,
} from "./di";
export * from "./events";
export {
	createRestClient,
	deleteRemoteCommand,
	fetchCommands,
	syncCommand,
} from "./rest";
export * from "./search";
export * from "./storage";
