/**
 * Category Operations for Memory Command Repository
 */

import type { Result } from "../../shared/types";
import type { Command } from "../../types";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";

export const findByCategory = (state: MemoryCommandRepositoryState, category: string): Result<readonly Command[]> => {
	try {
		const commands = Array.from(state.commands.values()).filter((command) => command.category === category);
		return { success: true, data: commands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const getAllCategories = (state: MemoryCommandRepositoryState): Result<readonly string[]> => {
	try {
		const categories = Array.from(state.commands.values())
			.map((command) => command.category)
			.filter((category): category is string => Boolean(category))
			.filter((category, index, array) => array.indexOf(category) === index);

		return { success: true, data: categories };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};
