/**
 * Command History Repository Port - Interface for command history persistence
 * Defines contract for command history storage operations
 */

import type { Result } from "../shared/types";
import type { CommandHistory, CommandHistoryEntry } from "../types";

export interface CommandHistoryRepository {
	// CRUD operations
	saveHistory(history: CommandHistory): Promise<Result<CommandHistory>>;
	getHistory(): Promise<Result<CommandHistory>>;
	addEntry(entry: CommandHistoryEntry): Promise<Result<CommandHistoryEntry>>;
	removeEntry(entryId: string): Promise<Result<void>>;
	clearHistory(): Promise<Result<CommandHistory>>;

	// Query operations
	findById(entryId: string): Promise<Result<CommandHistoryEntry | null>>;
	findByCommandId(commandId: string): Promise<Result<readonly CommandHistoryEntry[]>>;
	findBySuccess(success: boolean): Promise<Result<readonly CommandHistoryEntry[]>>;
	search(query: string): Promise<Result<readonly CommandHistoryEntry[]>>;

	// Count operations
	count(): Promise<Result<number>>;
	countSuccessful(): Promise<Result<number>>;
	countFailed(): Promise<Result<number>>;
}
