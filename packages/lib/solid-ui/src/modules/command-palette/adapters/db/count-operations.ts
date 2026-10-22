/**
 * Count Operations for Memory Command Repository
 */

import type { Result } from "../../shared/types";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";

export const countCommands = (state: MemoryCommandRepositoryState): Result<number> => {
	try {
		return { success: true, data: state.commands.size };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const countByCategory = (state: MemoryCommandRepositoryState, category: string): Result<number> => {
	try {
		const count = Array.from(state.commands.values()).filter((command) => command.category === category).length;
		return { success: true, data: count };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const countEnabled = (state: MemoryCommandRepositoryState): Result<number> => {
	try {
		const count = Array.from(state.commands.values()).filter((command) => command.enabled).length;
		return { success: true, data: count };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const countDisabled = (state: MemoryCommandRepositoryState): Result<number> => {
	try {
		const count = Array.from(state.commands.values()).filter((command) => !command.enabled).length;
		return { success: true, data: count };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};
