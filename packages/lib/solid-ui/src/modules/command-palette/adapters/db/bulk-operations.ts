/**
 * Bulk Operations for Memory Command Repository
 */

import type { Result } from "../../shared/types";
import type { Command } from "../../types";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";

export const saveManyCommands = (
	state: MemoryCommandRepositoryState,
	commands: readonly Command[],
): Result<MemoryCommandRepositoryState> => {
	try {
		const newCommands = new Map(state.commands);
		for (const command of commands) {
			newCommands.set(command.id, command);
		}
		return { success: true, data: { ...state, commands: newCommands } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const deleteManyCommands = (
	state: MemoryCommandRepositoryState,
	ids: readonly string[],
): Result<MemoryCommandRepositoryState> => {
	try {
		const newCommands = new Map(state.commands);
		for (const id of ids) {
			newCommands.delete(id);
		}
		return { success: true, data: { ...state, commands: newCommands } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};
