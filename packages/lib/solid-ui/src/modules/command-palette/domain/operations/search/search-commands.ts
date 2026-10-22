/**
 * Search Commands - Pure search operations for commands
 * No external dependencies, pure functions only
 */

import type { Result } from "../../../shared/types";
import type { Command, CommandFilter, CommandSearchQuery } from "../../../types";
import { commandMatchesCategory, commandMatchesQuery } from "../../models/command";

// Main search function
export const searchCommands = (commands: readonly Command[], query: CommandSearchQuery): Result<readonly Command[]> => {
	try {
		let filteredCommands: Command[] = [...commands];

		// Apply text search
		if (query.query && query.query.trim().length > 0) {
			filteredCommands = filteredCommands.filter((command) => commandMatchesQuery(command, query.query));
		}

		// Apply category filter
		if (query.category) {
			filteredCommands = filteredCommands.filter((command) => commandMatchesCategory(command, query.category));
		}

		// Apply enabled filter
		if (query.enabled !== undefined) {
			filteredCommands = filteredCommands.filter((command) => command.enabled === query.enabled);
		}

		// Apply additional filters
		if (query.filter) {
			filteredCommands = applyCommandFilters(filteredCommands, query.filter);
		}

		// Apply pagination
		const offset = query.offset || 0;
		const limit = query.limit || 10;
		const paginatedCommands = filteredCommands.slice(offset, offset + limit);

		return { success: true, data: paginatedCommands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Search failed"),
		};
	}
};

// Filter commands by various criteria
export const filterCommands = (commands: readonly Command[], filter: CommandFilter): Result<readonly Command[]> => {
	try {
		const filtered: Command[] = applyCommandFilters(commands, filter);
		return { success: true, data: filtered };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Filter failed"),
		};
	}
};

// Get commands by category
export const getCommandsByCategory = (commands: readonly Command[], category: string): Result<readonly Command[]> => {
	try {
		const categoryCommands = commands.filter((command) => commandMatchesCategory(command, category));
		return { success: true, data: categoryCommands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Category filter failed"),
		};
	}
};

// Get enabled commands only
export const getEnabledCommands = (commands: readonly Command[]): Result<readonly Command[]> => {
	try {
		const enabledCommands = commands.filter((command) => command.enabled);
		return { success: true, data: enabledCommands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Enabled filter failed"),
		};
	}
};

// Get commands with hotkeys
export const getCommandsWithHotkeys = (commands: readonly Command[]): Result<readonly Command[]> => {
	try {
		const commandsWithHotkeys = commands.filter((command) =>
			Boolean(command.hotkey && command.hotkey.trim().length > 0),
		);
		return { success: true, data: commandsWithHotkeys };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Hotkey filter failed"),
		};
	}
};

// Search by keywords
export const searchByKeywords = (
	commands: readonly Command[],
	keywords: readonly string[],
): Result<readonly Command[]> => {
	try {
		const keywordCommands = commands.filter((command) =>
			keywords.some((keyword) =>
				command.keywords?.some((cmdKeyword) => cmdKeyword.toLowerCase().includes(keyword.toLowerCase())),
			),
		);
		return { success: true, data: keywordCommands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Keyword search failed"),
		};
	}
};

// Helper function to apply filters
const applyCommandFilters = (commands: readonly Command[], filter: CommandFilter): Command[] => {
	let filtered: Command[] = [...commands];

	// Filter by categories
	if (filter.categories && filter.categories.length > 0) {
		filtered = filtered.filter((command) => filter.categories?.includes(command.category || "general"));
	}

	// Filter by enabled status
	if (filter.enabled !== undefined) {
		filtered = filtered.filter((command) => command.enabled === filter.enabled);
	}

	// Filter by keywords presence
	if (filter.hasKeywords !== undefined) {
		filtered = filtered.filter((command) =>
			filter.hasKeywords
				? command.keywords && command.keywords.length > 0
				: !command.keywords || command.keywords.length === 0,
		);
	}

	// Filter by hotkey presence
	if (filter.hasHotkey !== undefined) {
		filtered = filtered.filter((command) =>
			filter.hasHotkey
				? Boolean(command.hotkey && command.hotkey.trim().length > 0)
				: !command.hotkey || command.hotkey.trim().length === 0,
		);
	}

	return filtered;
};
