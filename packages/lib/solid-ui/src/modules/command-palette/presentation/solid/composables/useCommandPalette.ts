/**
 * useCommandPalette - SolidJS composable for command palette (Functional style)
 */

import { createSignal, onCleanup, onMount } from "solid-js";
import { createCommandRepository } from "../../../adapters/db/command-repository-adapter";
import { createMemoryCommandRepository } from "../../../adapters/db/memory-command-repository";
import { createEventDispatcher, createMemoryEventDispatcher } from "../../../adapters/events/memory-event-dispatcher";
import { searchCommandsUseCase } from "../../../application/usecases/search";
import { DEFAULT_MAX_RESULTS } from "../../../domain/constants";
import type { CommandRepository, EventDispatcher } from "../../../ports";
import type { Command } from "../../../types";

function getCommandRepository(repository?: CommandRepository) {
	const repoState = createMemoryCommandRepository();
	return repository || createCommandRepository(repoState);
}

function getEventDispatcher(): EventDispatcher {
	const eventDispatcherState = createMemoryEventDispatcher();
	return createEventDispatcher(eventDispatcherState);
}

function createOpenActions(
	isOpen: () => boolean,
	setIsOpen: (open: boolean) => void,
	setSearchQuery: (query: string) => void,
	setSelectedIndex: (index: number) => void,
) {
	const open = () => {
		setIsOpen(true);
		setSearchQuery("");
		setSelectedIndex(0);
	};

	const close = () => {
		setIsOpen(false);
	};

	const toggle = () => {
		isOpen() ? close() : open();
	};

	return { open, close, toggle };
}

function createRegisterAction(
	commandRepository: CommandRepository,
	commands: () => Command[],
	setCommands: (commands: Command[]) => void,
) {
	return async (command: Command) => {
		try {
			setCommands([...commands(), command]);
			const saveResult = await commandRepository.save(command);
			if (!saveResult.success) {
				console.error("Failed to register command", saveResult.error);
			}
		} catch (error) {
			console.error("Error registering command", error);
		}
	};
}

function createUnregisterAction(
	commandRepository: CommandRepository,
	commands: () => Command[],
	setCommands: (commands: Command[]) => void,
) {
	return async (id: string) => {
		try {
			setCommands(commands().filter((c) => c.id !== id));
			const deleteResult = await commandRepository.delete(id);
			if (!deleteResult.success) {
				console.error("Failed to unregister command", deleteResult.error);
			}
		} catch (error) {
			console.error("Error unregistering command", error);
		}
	};
}

function createSearchAction(
	commandRepository: CommandRepository,
	eventDispatcher: EventDispatcher,
	setSearchQuery: (query: string) => void,
	setFilteredCommands: (commands: Command[]) => void,
) {
	return async (query: string) => {
		try {
			setSearchQuery(query);
			const allCommandsResult = await commandRepository.findAll();
			if (!allCommandsResult.success) {
				console.error("Failed to fetch commands", allCommandsResult.error);
				return;
			}

			const searchUseCase = searchCommandsUseCase(commandRepository, eventDispatcher);
			const result = await searchUseCase({ query, limit: DEFAULT_MAX_RESULTS });
			if (result.success) {
				setFilteredCommands([...result.data.commands] as Command[]);
			} else {
				console.error("Search failed", result.error);
			}
		} catch (error) {
			console.error("Error during search", error);
		}
	};
}

function createExecuteAction(close: () => void) {
	return async (command: Command) => {
		try {
			// Execute command action based on type
			if (command.action.type === "url" && typeof command.action.payload === "string") {
				window.open(command.action.payload, "_blank");
			} else if (command.action.type === "function" && typeof command.action.payload === "function") {
				await command.action.payload();
			}
			close();
		} catch (error) {
			console.error("Error executing command", error);
		}
	};
}

function createKeyDownHandler(
	close: () => void,
	selectedIndex: () => number,
	setSelectedIndex: (index: number) => void,
	filteredCommands: () => Command[],
	execute: (command: Command) => Promise<void>,
) {
	return (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			close();
		} else if (event.key === "ArrowDown") {
			setSelectedIndex(Math.min(selectedIndex() + 1, filteredCommands().length - 1));
		} else if (event.key === "ArrowUp") {
			setSelectedIndex(Math.max(selectedIndex() - 1, 0));
		} else if (event.key === "Enter") {
			const selectedCommand = filteredCommands()[selectedIndex()];
			if (selectedCommand) {
				execute(selectedCommand);
			}
		}
	};
}

export function useCommandPalette(repository?: CommandRepository) {
	const [isOpen, setIsOpen] = createSignal(false);
	const [searchQuery, setSearchQuery] = createSignal("");
	const [selectedIndex, setSelectedIndex] = createSignal(0);

	const commandRepository = getCommandRepository(repository);
	const eventDispatcher = getEventDispatcher();

	const [commands, setCommands] = createSignal<Command[]>([]);
	const [filteredCommands, setFilteredCommands] = createSignal<Command[]>([]);

	const { open, close, toggle } = createOpenActions(isOpen, setIsOpen, setSearchQuery, setSelectedIndex);
	const registerCommand = createRegisterAction(commandRepository, commands, setCommands);
	const unregisterCommand = createUnregisterAction(commandRepository, commands, setCommands);
	const search = createSearchAction(commandRepository, eventDispatcher, setSearchQuery, setFilteredCommands);
	const execute = createExecuteAction(close);
	const handleKeyDown = createKeyDownHandler(close, selectedIndex, setSelectedIndex, filteredCommands, execute);

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	onCleanup(() => {
		window.removeEventListener("keydown", handleKeyDown);
	});

	return {
		isOpen,
		searchQuery,
		selectedIndex,
		commands,
		filteredCommands,
		open,
		close,
		toggle,
		registerCommand,
		unregisterCommand,
		search,
		execute,
		handleKeyDown,
	};
}
