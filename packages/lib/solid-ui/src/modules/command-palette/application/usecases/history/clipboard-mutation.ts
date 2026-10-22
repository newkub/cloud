/**
 * Clipboard History Mutation Use Cases - Application orchestration
 * Handles clipboard history mutations (add, remove, clear)
 */

import {
	addToClipboardHistory,
	clearClipboardHistory,
	createClipboardEntry,
	removeFromClipboardHistory,
	validateClipboardEntry,
} from "../../../domain/operations/clipboard";
import type { ClipboardRepository, EventDispatcher } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { ClipboardEntry, ClipboardHistory } from "../../../types";

export interface AddClipboardEntryRequest {
	readonly content: string;
	readonly type?: ClipboardEntry["type"];
	readonly metadata?: Record<string, unknown>;
}

export const addClipboardEntryUseCase =
	(clipboardRepository: ClipboardRepository, _eventDispatcher: EventDispatcher) =>
	async (request: AddClipboardEntryRequest): Promise<Result<ClipboardEntry>> => {
		try {
			// Step 1: Create clipboard entry
			const createResult = createClipboardEntry(request.content, request.type, request.metadata);
			if (!createResult.success) {
				return {
					success: false,
					error: ValidationError("clipboard", createResult.error.message),
				};
			}

			const entry = createResult.data;

			// Step 2: Validate entry
			const validationResult = validateClipboardEntry(entry);
			if (!validationResult.success) {
				return {
					success: false,
					error: ValidationError("clipboard", validationResult.error.message),
				};
			}

			// Step 3: Get current history
			const historyResult = await clipboardRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"addClipboardEntry",
						"Failed to get clipboard history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 4: Add entry to history
			const addResult = addToClipboardHistory(historyResult.data, entry);
			if (!addResult.success) {
				return {
					success: false,
					error: ValidationError("clipboard", (addResult as { success: false; error: Error }).error.message),
				};
			}

			// Step 5: Save updated history
			const saveResult = await clipboardRepository.saveHistory(addResult.data);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"addClipboardEntry",
						"Failed to save clipboard history",
						(saveResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 6: Dispatch event
			// Note: Would need clipboard entry added event type
			// const event = createClipboardEntryAddedEvent(entry);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: entry };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"addClipboardEntry",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const removeClipboardEntryUseCase =
	(clipboardRepository: ClipboardRepository, _eventDispatcher: EventDispatcher) =>
	async (entryId: string): Promise<Result<ClipboardHistory>> => {
		try {
			// Step 1: Get current history
			const historyResult = await clipboardRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"removeClipboardEntry",
						"Failed to get clipboard history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 2: Remove entry from history
			const removeResult = removeFromClipboardHistory(historyResult.data, entryId);
			if (!removeResult.success) {
				return {
					success: false,
					error: ValidationError("clipboard", (removeResult as { success: false; error: Error }).error.message),
				};
			}

			// Step 3: Save updated history
			const saveResult = await clipboardRepository.saveHistory(removeResult.data);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"removeClipboardEntry",
						"Failed to save clipboard history",
						(saveResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 4: Dispatch event
			// Note: Would need clipboard entry removed event type
			// const event = createClipboardEntryRemovedEvent(entryId);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: removeResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"removeClipboardEntry",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const clearClipboardHistoryUseCase =
	(clipboardRepository: ClipboardRepository, _eventDispatcher: EventDispatcher) =>
	async (): Promise<Result<ClipboardHistory>> => {
		try {
			// Step 1: Clear history
			const clearResult = clearClipboardHistory();
			if (!clearResult.success) {
				return {
					success: false,
					error: ValidationError("clipboard", (clearResult as { success: false; error: Error }).error.message),
				};
			}

			// Step 2: Save cleared history
			const saveResult = await clipboardRepository.saveHistory(clearResult.data);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"clearClipboardHistory",
						"Failed to save clipboard history",
						(saveResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 3: Dispatch event
			// Note: Would need clipboard history cleared event type
			// const event = createClipboardHistoryClearedEvent();
			// await eventDispatcher.dispatch(event);

			return { success: true, data: clearResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"clearClipboardHistory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
