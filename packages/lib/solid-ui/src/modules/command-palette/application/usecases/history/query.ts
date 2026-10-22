/**
 * Command History Query Use Cases - Application orchestration
 * Handles command execution history queries (search, stats, filter)
 */

import {
	filterCommandHistoryBySuccess,
	getCommandHistoryStats,
	searchCommandHistory,
} from "../../../domain/operations/history";
import type { CommandHistoryRepository } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { CommandHistoryEntry } from "../../../types";

export const searchCommandHistoryUseCase =
	(commandHistoryRepository: CommandHistoryRepository) =>
	async (query: string): Promise<Result<readonly CommandHistoryEntry[]>> => {
		try {
			// Step 1: Get current history
			const historyResult = await commandHistoryRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"searchCommandHistory",
						"Failed to get command history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 2: Search history
			const searchResult = searchCommandHistory(historyResult.data, query);
			if (!searchResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", (searchResult as { success: false; error: Error }).error.message),
				};
			}

			return { success: true, data: searchResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"searchCommandHistory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const getCommandHistoryStatsUseCase =
	(commandHistoryRepository: CommandHistoryRepository) =>
	async (): Promise<Result<ReturnType<typeof getCommandHistoryStats>>> => {
		try {
			// Step 1: Get current history
			const historyResult = await commandHistoryRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"getCommandHistoryStats",
						"Failed to get command history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 2: Calculate stats
			const stats = getCommandHistoryStats(historyResult.data);

			return { success: true, data: stats };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"getCommandHistoryStats",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const filterCommandHistoryBySuccessUseCase =
	(commandHistoryRepository: CommandHistoryRepository) =>
	async (success: boolean): Promise<Result<readonly CommandHistoryEntry[]>> => {
		try {
			// Step 1: Get current history
			const historyResult = await commandHistoryRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"filterCommandHistoryBySuccess",
						"Failed to get command history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 2: Filter by success
			const filterResult = filterCommandHistoryBySuccess(historyResult.data, success);
			if (!filterResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", (filterResult as { success: false; error: Error }).error.message),
				};
			}

			return { success: true, data: filterResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"filterCommandHistoryBySuccess",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
