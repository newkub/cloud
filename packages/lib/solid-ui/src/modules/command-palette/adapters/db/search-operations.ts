/**
 * Search Operations for Memory Command Repository
 */

import type { PaginatedResult, Result } from "../../shared/types";
import type { Command, CommandSearchQuery } from "../../types";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";

// Pure function: filter commands by search criteria
const filterCommandsByQuery = (commands: readonly Command[], query: CommandSearchQuery): Command[] => {
	let filtered = [...commands];

	if (query.query && query.query.trim().length > 0) {
		const lowerQuery = query.query.toLowerCase();
		filtered = filtered.filter(
			(command) =>
				command.label.toLowerCase().includes(lowerQuery) ||
				command.description?.toLowerCase().includes(lowerQuery) ||
				command.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery)),
		);
	}

	if (query.category) {
		filtered = filtered.filter((command) => command.category === query.category);
	}

	if (query.enabled !== undefined) {
		filtered = filtered.filter((command) => command.enabled === query.enabled);
	}

	return filtered;
};

export const searchCommands = (
	state: MemoryCommandRepositoryState,
	query: CommandSearchQuery,
): Result<readonly Command[]> => {
	try {
		const commands = Array.from(state.commands.values());
		const filtered = filterCommandsByQuery(commands, query);

		const offset = query.offset || 0;
		const limit = query.limit || 10;
		const paginatedCommands = filtered.slice(offset, offset + limit);

		return { success: true, data: paginatedCommands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const searchPaginated = (
	state: MemoryCommandRepositoryState,
	query: CommandSearchQuery,
): Result<PaginatedResult<Command>> => {
	try {
		const commands = Array.from(state.commands.values());
		const filtered = filterCommandsByQuery(commands, query);

		const offset = query.offset || 0;
		const limit = query.limit || 10;
		const paginatedCommands = filtered.slice(offset, offset + limit);

		const paginatedResult: PaginatedResult<Command> = {
			items: paginatedCommands,
			total: filtered.length,
			pagination: {
				page: Math.floor(offset / limit) + 1,
				limit,
				offset,
			},
		};

		return { success: true, data: paginatedResult };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};
