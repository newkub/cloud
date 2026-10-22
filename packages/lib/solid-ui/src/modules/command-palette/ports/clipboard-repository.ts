/**
 * Clipboard Repository Port - Interface for clipboard history persistence
 * Defines contract for clipboard storage operations
 */

import type { Result } from "../shared/types";
import type { ClipboardEntry, ClipboardHistory } from "../types";

export interface ClipboardRepository {
	// CRUD operations
	saveHistory(history: ClipboardHistory): Promise<Result<ClipboardHistory>>;
	getHistory(): Promise<Result<ClipboardHistory>>;
	addEntry(entry: ClipboardEntry): Promise<Result<ClipboardEntry>>;
	removeEntry(entryId: string): Promise<Result<void>>;
	clearHistory(): Promise<Result<ClipboardHistory>>;

	// Query operations
	findById(entryId: string): Promise<Result<ClipboardEntry | null>>;
	findByType(type: ClipboardEntry["type"]): Promise<Result<readonly ClipboardEntry[]>>;
	search(query: string): Promise<Result<readonly ClipboardEntry[]>>;

	// Count operations
	count(): Promise<Result<number>>;
	countByType(type: ClipboardEntry["type"]): Promise<Result<number>>;
}
