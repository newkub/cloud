/**
 * Database Adapters - Repository implementations
 * Functional implementations of repository ports
 */

export { deleteManyCommands, saveManyCommands } from "./bulk-operations";
export { findByCategory, getAllCategories } from "./category-operations";
export { createCommandRepository } from "./command-repository-adapter";
export {
	countByCategory,
	countCommands,
	countDisabled,
	countEnabled,
} from "./count-operations";
export {
	deleteCommand,
	disableCommand,
	enableCommand,
	findAllCommands,
	findCommandById,
	saveCommand,
	updateCommand,
} from "./crud-operations";
export {
	clearRepository,
	createMemoryCommandRepository,
	getRepositorySize,
	seedRepository,
} from "./memory-command-repository";
export { searchCommands, searchPaginated } from "./search-operations";
