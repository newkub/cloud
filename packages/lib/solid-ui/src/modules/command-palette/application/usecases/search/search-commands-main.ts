// Main search commands use case

import { createCommandSearchedEvent } from "../../../domain/events/command-events";
import { searchCommandsService } from "../../../domain/operations/search";
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

export const searchCommandsUseCase =
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

			// Step 2: Get all commands from repository
			const allCommandsResult = await commandRepository.findAll();
			if (!allCommandsResult.success) {
				return {
					success: false,
					error: UseCaseError("searchCommands", "Failed to fetch commands", allCommandsResult.error),
				};
			}

			// Step 3: Perform domain search
			const searchResult = searchCommandsService(allCommandsResult.data, validationResult.data);

			// Step 4: Calculate metrics
			const executionTime = Date.now() - startTime;
			const totalCount = allCommandsResult.data.length;

			// Step 5: Dispatch search event
			const event = createCommandSearchedEvent(query.query || "", searchResult.commands.length, executionTime);

			const dispatchResult = await eventDispatcher.dispatch(event);
			if (!dispatchResult.success) {
				// Event dispatch failed - continue with response
			}

			// Step 6: Return response
			return {
				success: true,
				data: {
					commands: searchResult.commands,
					totalCount,
					query: query.query || "",
					executionTime,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"searchCommands",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
