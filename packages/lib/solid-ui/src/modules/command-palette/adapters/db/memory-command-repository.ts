/**
 * Memory Command Repository - In-memory implementation
 * Functional style with immutable state
 */

import type { Command } from "../../types";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";

export type { MemoryCommandRepositoryState };

// Factory function
export const createMemoryCommandRepository = (
	initialCommands?: Map<string, Command>,
): MemoryCommandRepositoryState => ({
	commands: initialCommands || new Map(),
});

// Utility: Clear all commands
export const clearRepository = (): MemoryCommandRepositoryState => createMemoryCommandRepository(new Map());

// Utility: Get size
export const getRepositorySize = (state: MemoryCommandRepositoryState): number => state.commands.size;

// Utility: Seed with sample data
export const seedRepository = (
	state: MemoryCommandRepositoryState,
	commands: readonly Command[],
): MemoryCommandRepositoryState => {
	const newCommands = new Map(state.commands);
	for (const command of commands) {
		newCommands.set(command.id, command);
	}
	return { ...state, commands: newCommands };
};

export { deleteManyCommands, saveManyCommands } from "./bulk-operations";
export { findByCategory, getAllCategories } from "./category-operations";
export { createCommandRepository } from "./command-repository-adapter";
export {
	countByCategory,
	countCommands,
	countDisabled,
	countEnabled,
} from "./count-operations";
// Re-export operations
export {
	deleteCommand,
	disableCommand,
	enableCommand,
	findAllCommands,
	findCommandById,
	saveCommand,
	updateCommand,
} from "./crud-operations";
export { searchCommands, searchPaginated } from "./search-operations";
