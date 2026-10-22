/**
 * Command History Manager Port - Interface for command history management
 */

import type { CommandHistory, CommandHistoryEntry } from "../../types";

export interface CommandHistoryManager {
	getHistory(): CommandHistory;
	addEntry(commandId: string, query?: string): void;
	clearHistory(): void;
	getRecentEntries(limit?: number): readonly CommandHistoryEntry[];
}
