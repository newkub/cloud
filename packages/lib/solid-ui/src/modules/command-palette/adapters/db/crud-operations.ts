/**
 * CRUD Operations for Memory Command Repository
 */

import type { Result } from "../../shared/types";
import type { Command } from "../../types";
import type { MemoryCommandRepositoryState } from "./memory-command-repository-state";

export const saveCommand = (
	state: MemoryCommandRepositoryState,
	command: Command,
): Result<MemoryCommandRepositoryState> => {
	try {
		const newCommands = new Map(state.commands);
		newCommands.set(command.id, command);
		return { success: true, data: { ...state, commands: newCommands } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const findCommandById = (state: MemoryCommandRepositoryState, id: string): Result<Command | null> => {
	try {
		const command = state.commands.get(id) || null;
		return { success: true, data: command };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const findAllCommands = (state: MemoryCommandRepositoryState): Result<readonly Command[]> => {
	try {
		const commands = Array.from(state.commands.values());
		return { success: true, data: commands };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const updateCommand = (
	state: MemoryCommandRepositoryState,
	id: string,
	updates: Partial<Command>,
): Result<MemoryCommandRepositoryState> => {
	try {
		const existingCommand = state.commands.get(id);
		if (!existingCommand) {
			return {
				success: false,
				error: new Error(`Command with id ${id} not found`),
			};
		}

		const updatedCommand: Command = {
			...existingCommand,
			...updates,
			id,
			updatedAt: new Date(),
		};

		const newCommands = new Map(state.commands);
		newCommands.set(id, updatedCommand);
		return { success: true, data: { ...state, commands: newCommands } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const deleteCommand = (
	state: MemoryCommandRepositoryState,
	id: string,
): Result<MemoryCommandRepositoryState> => {
	try {
		const newCommands = new Map(state.commands);
		newCommands.delete(id);
		return { success: true, data: { ...state, commands: newCommands } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
};

export const enableCommand = (state: MemoryCommandRepositoryState, id: string): Result<MemoryCommandRepositoryState> =>
	updateCommand(state, id, { enabled: true });

export const disableCommand = (state: MemoryCommandRepositoryState, id: string): Result<MemoryCommandRepositoryState> =>
	updateCommand(state, id, { enabled: false });
