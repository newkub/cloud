/**
 * CommandRepository Adapter for Memory Command Repository
 * Provides backward compatibility with CommandRepository interface
 */

import type { CommandRepository } from "../../ports";
import type { Command } from "../../types";
import { deleteManyCommands, saveManyCommands } from "./bulk-operations";
import { findByCategory, getAllCategories } from "./category-operations";
import { countByCategory, countCommands, countDisabled, countEnabled } from "./count-operations";
import {
	deleteCommand,
	disableCommand,
	enableCommand,
	findAllCommands,
	findCommandById,
	saveCommand,
	updateCommand,
} from "./crud-operations";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";
import { searchCommands, searchPaginated } from "./search-operations";

export const createCommandRepository = (state: MemoryCommandRepositoryState): CommandRepository => ({
	save: (command) => {
		const result = saveCommand(state, command);
		return Promise.resolve(
			result.success ? { success: true, data: result.data.commands.get(command.id) as Command } : result,
		);
	},
	findById: (id) => Promise.resolve(findCommandById(state, id)),
	findAll: () => Promise.resolve(findAllCommands(state)),
	update: (id, updates) => {
		const result = updateCommand(state, id, updates);
		return Promise.resolve(result.success ? { success: true, data: result.data.commands.get(id) as Command } : result);
	},
	delete: (id) => {
		const result = deleteCommand(state, id);
		return Promise.resolve(result.success ? { success: true, data: undefined } : result);
	},
	search: (query) => Promise.resolve(searchCommands(state, query)),
	searchPaginated: (query) => Promise.resolve(searchPaginated(state, query)),
	findByCategory: (category) => Promise.resolve(findByCategory(state, category)),
	getAllCategories: () => Promise.resolve(getAllCategories(state)),
	enableCommand: (id) => {
		const result = enableCommand(state, id);
		return Promise.resolve(result.success ? { success: true, data: result.data.commands.get(id) as Command } : result);
	},
	disableCommand: (id) => {
		const result = disableCommand(state, id);
		return Promise.resolve(result.success ? { success: true, data: result.data.commands.get(id) as Command } : result);
	},
	saveMany: (commands) => {
		const result = saveManyCommands(state, commands);
		return Promise.resolve(result.success ? { success: true, data: commands } : result);
	},
	deleteMany: (ids) => {
		const result = deleteManyCommands(state, ids);
		return Promise.resolve(result.success ? { success: true, data: undefined } : result);
	},
	count: () => Promise.resolve(countCommands(state)),
	countByCategory: (category) => Promise.resolve(countByCategory(state, category)),
	countEnabled: () => Promise.resolve(countEnabled(state)),
	countDisabled: () => Promise.resolve(countDisabled(state)),
});
