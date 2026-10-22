/**
 * Command Palette Search - Search and filtering logic
 */

import { searchCommandsUseCase } from "../../../application/usecases/search";
import { DEFAULT_MAX_RESULTS } from "../../../domain/constants";
import type { CommandRepository } from "../../../ports";
import type { Command } from "../../../types";

export const searchCommands = async (commandRepository: CommandRepository, query: string): Promise<Command[]> => {
	const allCommandsResult = await commandRepository.findAll();
	if (!allCommandsResult.success) return [];

	const searchUseCase = searchCommandsUseCase(commandRepository, {
		dispatch: async (_event) => ({ success: true, data: undefined }),
		dispatchBatch: async () => ({ success: true, data: undefined }),
		subscribe: async () => ({ success: true, data: "" }),
		unsubscribe: async () => ({ success: true, data: undefined }),
		getActiveSubscriptions: async () => ({ success: true, data: [] }),
	});
	const result = await searchUseCase({ query, limit: DEFAULT_MAX_RESULTS });
	return result.success ? [...result.data.commands] : [];
};
