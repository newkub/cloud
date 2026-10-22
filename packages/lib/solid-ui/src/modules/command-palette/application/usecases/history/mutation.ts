/**
 * Command History Mutation Use Cases - Application orchestration
 * Handles command execution history mutations (add, remove, clear)
 */

import {
	addToCommandHistory,
	clearCommandHistory,
	createCommandHistoryEntry,
	removeFromCommandHistory,
	validateCommandHistoryEntry,
} from "../../../domain/operations/history";
import type { CommandHistoryRepository, EventDispatcher } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { CommandHistory, CommandHistoryEntry } from "../../../types";

export interface AddCommandHistoryEntryRequest {
	readonly commandId: string;
	readonly success: boolean;
	readonly result?: unknown;
	readonly error?: string;
	readonly executionTime?: number;
}

export const addCommandHistoryEntryUseCase =
	(commandHistoryRepository: CommandHistoryRepository, _eventDispatcher: EventDispatcher) =>
	async (request: AddCommandHistoryEntryRequest): Promise<Result<CommandHistoryEntry>> => {
		try {
			// Step 1: Create history entry
			const createResult = createCommandHistoryEntry(
				request.commandId,
				request.success,
				request.result,
				request.error,
				request.executionTime,
			);
			if (!createResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", createResult.error.message),
				};
			}

			const entry = createResult.data;

			// Step 2: Validate entry
			const validationResult = validateCommandHistoryEntry(entry);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", validationResult.error.message),
				};
			}

			// Step 3: Get current history
			const historyResult = await commandHistoryRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"addCommandHistoryEntry",
						"Failed to get command history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 4: Add entry to history
			const addResult = addToCommandHistory(historyResult.data, entry);
			if (!addResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", (addResult as { success: false; error: Error }).error.message),
				};
			}

			// Step 5: Save updated history
			const saveResult = await commandHistoryRepository.saveHistory(addResult.data);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"addCommandHistoryEntry",
						"Failed to save command history",
						(saveResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 6: Dispatch event
			// Note: Would need command history entry added event type
			// const event = createCommandHistoryEntryAddedEvent(entry);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: entry };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"addCommandHistoryEntry",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const removeCommandHistoryEntryUseCase =
	(commandHistoryRepository: CommandHistoryRepository, _eventDispatcher: EventDispatcher) =>
	async (entryId: string): Promise<Result<CommandHistory>> => {
		try {
			// Step 1: Get current history
			const historyResult = await commandHistoryRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"removeCommandHistoryEntry",
						"Failed to get command history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 2: Remove entry from history
			const removeResult = removeFromCommandHistory(historyResult.data, entryId);
			if (!removeResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", (removeResult as { success: false; error: Error }).error.message),
				};
			}

			// Step 3: Save updated history
			const saveResult = await commandHistoryRepository.saveHistory(removeResult.data);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"removeCommandHistoryEntry",
						"Failed to save command history",
						(saveResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 4: Dispatch event
			// Note: Would need command history entry removed event type
			// const event = createCommandHistoryEntryRemovedEvent(entryId);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: removeResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"removeCommandHistoryEntry",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const clearCommandHistoryUseCase =
	(commandHistoryRepository: CommandHistoryRepository, _eventDispatcher: EventDispatcher) =>
	async (): Promise<Result<CommandHistory>> => {
		try {
			// Step 1: Clear history
			const clearResult = clearCommandHistory();
			if (!clearResult.success) {
				return {
					success: false,
					error: ValidationError("command-history", (clearResult as { success: false; error: Error }).error.message),
				};
			}

			// Step 2: Save cleared history
			const saveResult = await commandHistoryRepository.saveHistory(clearResult.data);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"clearCommandHistory",
						"Failed to save command history",
						(saveResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 3: Dispatch event
			// Note: Would need command history cleared event type
			// const event = createCommandHistoryClearedEvent();
			// await eventDispatcher.dispatch(event);

			return { success: true, data: clearResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"clearCommandHistory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
