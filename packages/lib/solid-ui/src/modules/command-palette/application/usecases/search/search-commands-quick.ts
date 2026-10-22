// Quick search use case (for autocomplete/suggestions)

import type { CommandRepository } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { Command, CommandSearchQuery } from "../../../types";

export const quickSearchUseCase =
	(commandRepository: CommandRepository) =>
	async (query: string, limit: number = 5): Promise<Result<readonly Command[]>> => {
		try {
			// Step 1: Validate quick search parameters
			if (!query || query.trim().length === 0) {
				return { success: true, data: [] };
			}

			if (query.length < 1) {
				return { success: true, data: [] };
			}

			if (limit < 1 || limit > 20) {
				return {
					success: false,
					error: ValidationError("limit", "Limit must be between 1 and 20"),
				};
			}

			// Step 2: Perform quick search
			const searchQuery: CommandSearchQuery = {
				query: query.trim(),
				limit,
				enabled: true, // Only search enabled commands for quick search
			};

			const searchResult = await commandRepository.search(searchQuery);
			if (!searchResult.success) {
				return {
					success: false,
					error: UseCaseError("quickSearch", "Quick search failed", searchResult.error),
				};
			}

			return { success: true, data: searchResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"quickSearch",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
