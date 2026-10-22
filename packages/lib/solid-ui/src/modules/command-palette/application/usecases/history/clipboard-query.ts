/**
 * Clipboard History Query Use Cases - Application orchestration
 * Handles clipboard history queries (search)
 */

import { searchClipboardHistory } from "../../../domain/operations/clipboard";
import type { ClipboardRepository } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { ClipboardEntry } from "../../../types";

export const searchClipboardHistoryUseCase =
	(clipboardRepository: ClipboardRepository) =>
	async (query: string): Promise<Result<readonly ClipboardEntry[]>> => {
		try {
			// Step 1: Get current history
			const historyResult = await clipboardRepository.getHistory();
			if (!historyResult.success) {
				return {
					success: false,
					error: UseCaseError(
						"searchClipboardHistory",
						"Failed to get clipboard history",
						(historyResult as { success: false; error: Error }).error,
					),
				};
			}

			// Step 2: Search history
			const searchResult = searchClipboardHistory(historyResult.data, query);
			if (!searchResult.success) {
				return {
					success: false,
					error: ValidationError("clipboard", (searchResult as { success: false; error: Error }).error.message),
				};
			}

			return { success: true, data: searchResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"searchClipboardHistory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
