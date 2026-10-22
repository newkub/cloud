/**
 * Update Command Stats - Handles execution statistics updates
 */

import type { CommandRepository } from "../../../ports";
import type { Result } from "../../../shared/types";

export const updateCommandExecutionStats = async (
	commandRepository: CommandRepository,
	commandId: string,
): Promise<Result<void>> => {
	try {
		// Get the current command
		const commandResult = await commandRepository.findById(commandId);

		if (!commandResult.success || !commandResult.data) {
			return { success: false, error: new Error("Command not found") };
		}

		const command = commandResult.data;

		// Update execution statistics
		const updatedCommand = {
			...command,
			executionCount: (command.executionCount || 0) + 1,
			lastExecutedAt: new Date().toISOString(),
		};

		// Save the updated command
		const updateResult = await commandRepository.update(commandId, updatedCommand);

		if (!updateResult.success) {
			return { success: false, error: updateResult.error };
		}

		return { success: true, data: undefined };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error : new Error("Failed to update command stats"),
		};
	}
};
