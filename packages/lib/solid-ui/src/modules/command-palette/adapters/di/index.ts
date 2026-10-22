/**
 * Dependency Injection Container - DI for command palette
 * Provides centralized dependency management following functional principles
 */

import type { CommandRepository, EventDispatcher } from "../../ports";
import type { CommandSearcher } from "../../ports/search/command-searcher";
import type { Command } from "../../types";
import { createCommandRepository } from "../db/command-repository-adapter";
import type { MemoryCommandRepositoryState } from "../db/memory-command-repository";
import { createMemoryCommandRepository } from "../db/memory-command-repository";
import type { MemoryEventDispatcherState } from "../events/memory-event-dispatcher";
import { createEventDispatcher, createMemoryEventDispatcher } from "../events/memory-event-dispatcher";
import type { CustomCommandSearcherState } from "../search/fuse-command-searcher";
import { createCustomCommandSearcher } from "../search/fuse-command-searcher";
import { createClipboardStorage, createSnippetStorage } from "../storage";
import type { ClipboardStorageState } from "../storage/clipboard-storage";
import type { IStorage } from "../storage/local-storage-adapter";
import { createLocalStorageAdapter } from "../storage/local-storage-adapter";
import type { SnippetStorageState } from "../storage/snippet-storage";

export type DIContainerState = Readonly<{
	repositoryState: MemoryCommandRepositoryState;
	eventDispatcherState: MemoryEventDispatcherState;
	searcherState: CustomCommandSearcherState;
	clipboardStorageState: ClipboardStorageState;
	snippetStorageState: SnippetStorageState;
	storage: IStorage;
}>;

export const createDIContainer = (initialCommands?: Map<string, Command>): DIContainerState => {
	const repositoryState = createMemoryCommandRepository(initialCommands);
	const eventDispatcherState = createMemoryEventDispatcher();
	const searcherState = createCustomCommandSearcher([]);
	const storage = createLocalStorageAdapter();
	const clipboardStorageState = createClipboardStorage(storage);
	const snippetStorageState = createSnippetStorage();

	return {
		repositoryState,
		eventDispatcherState,
		searcherState,
		clipboardStorageState,
		snippetStorageState,
		storage,
	};
};

export const getCommandRepository = (state: DIContainerState): CommandRepository =>
	createCommandRepository(state.repositoryState);

export const getEventDispatcher = (state: DIContainerState): EventDispatcher =>
	createEventDispatcher(state.eventDispatcherState);

export const getCommandSearcher = (state: DIContainerState): CommandSearcher => ({
	search: async (commands, options) => {
		const { searchWithCustom } = await import("../search/fuse-command-searcher");
		return searchWithCustom(state.searcherState, commands, options);
	},
});

export const getClipboardStorage = (state: DIContainerState): ClipboardStorageState => state.clipboardStorageState;

export const getSnippetStorage = (state: DIContainerState): SnippetStorageState => state.snippetStorageState;

export const getStorage = (state: DIContainerState): IStorage => state.storage;

// Singleton instance for default use
let defaultContainer: DIContainerState | null = null;

export const getDefaultContainer = (): DIContainerState => {
	if (!defaultContainer) {
		defaultContainer = createDIContainer();
	}
	return defaultContainer;
};

export const resetDefaultContainer = (): void => {
	defaultContainer = null;
};
