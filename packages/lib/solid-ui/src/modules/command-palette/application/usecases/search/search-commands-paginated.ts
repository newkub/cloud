// Paginated search use case

import { createCommandSearchedEvent } from "../../../domain/events/command-events";
import type { CommandRepository, EventDispatcher } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { Command, CommandSearchQuery } from "../../../types";
import { validateSearchQuery } from "./search-commands-validation";

export interface SearchCommandsResponse {
	readonly commands: readonly Command[];
	readonly totalCount: number;
	readonly query: string;
	readonly executionTime: number;
}

export const searchCommandsPaginatedUseCase =
	(commandRepository: CommandRepository, eventDispatcher: EventDispatcher) =>
	async (query: CommandSearchQuery): Promise<Result<SearchCommandsResponse>> => {
		const startTime = Date.now();

		try {
			// Step 1: Validate search query
			const validationResult = validateSearchQuery(query);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("query", validationResult.error.message),
				};
			}

			// Step 2: Perform paginated search
			const searchResult = await commandRepository.searchPaginated(validationResult.data);
			if (!searchResult.success) {
				return {
					success: false,
					error: UseCaseError("searchCommandsPaginated", "Paginated search failed", searchResult.error),
				};
			}

			// Step 3: Calculate metrics
			const executionTime = Date.now() - startTime;

			// Step 4: Dispatch search event
			const event = createCommandSearchedEvent(query.query || "", searchResult.data.items.length, executionTime);

			const dispatchResult = await eventDispatcher.dispatch(event);
			if (!dispatchResult.success) {
				// Event dispatch failed - continue with response
			}

			// Step 5: Return response
			return {
				success: true,
				data: {
					commands: searchResult.data.items,
					totalCount: searchResult.data.total,
					query: query.query || "",
					executionTime,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"searchCommandsPaginated",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
