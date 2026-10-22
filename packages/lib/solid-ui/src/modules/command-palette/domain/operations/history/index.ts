/**
 * Command History Operations - Domain operations for command execution history
 */

import type { Result } from "../../../shared/types";
import type { CommandHistory, CommandHistoryEntry } from "../../../types/integration/history";

// Create command history entry
export const createCommandHistoryEntry = (
	commandId: string,
	success: boolean,
	result?: unknown,
	error?: string,
	executionTime?: number,
): Result<CommandHistoryEntry> => {
	if (!commandId || commandId.trim().length === 0) {
		return { success: false, error: new Error("Command ID is required") };
	}

	const entry: CommandHistoryEntry = {
		id: `history-${Date.now()}`,
		commandId,
		executedAt: new Date(),
		executionTime: executionTime ?? 0,
		success,
		result,
		error,
	};

	return { success: true, data: entry };
};

// Add entry to history
export const addToCommandHistory = (
	history: CommandHistory,
	entry: CommandHistoryEntry,
	maxEntries = 100,
): Result<CommandHistory> => {
	const newHistory = [entry, ...history];

	// Limit history size
	if (newHistory.length > maxEntries) {
		return { success: true, data: newHistory.slice(0, maxEntries) };
	}

	return { success: true, data: newHistory };
};

// Remove entry from history
export const removeFromCommandHistory = (history: CommandHistory, entryId: string): Result<CommandHistory> => {
	const newHistory = history.filter((entry) => entry.id !== entryId);
	return { success: true, data: newHistory };
};

// Clear command history
export const clearCommandHistory = (): Result<CommandHistory> => {
	return { success: true, data: [] };
};

// Search command history
export const searchCommandHistory = (
	history: CommandHistory,
	query: string,
): Result<readonly CommandHistoryEntry[]> => {
	if (!query || query.trim().length === 0) {
		return { success: true, data: history };
	}

	const lowerQuery = query.toLowerCase();
	const results = history.filter((entry) => entry.commandId.toLowerCase().includes(lowerQuery));

	return { success: true, data: results };
};

// Filter by success
export const filterCommandHistoryBySuccess = (
	history: CommandHistory,
	success: boolean,
): Result<readonly CommandHistoryEntry[]> => {
	const results = history.filter((entry) => entry.success === success);
	return { success: true, data: results };
};

// Filter by command ID
export const filterCommandHistoryByCommandId = (
	history: CommandHistory,
	commandId: string,
): Result<readonly CommandHistoryEntry[]> => {
	const results = history.filter((entry) => entry.commandId === commandId);
	return { success: true, data: results };
};

// Get execution statistics
export const getCommandHistoryStats = (history: CommandHistory) => {
	const total = history.length;
	const successful = history.filter((entry) => entry.success).length;
	const failed = total - successful;
	const avgExecutionTime = total > 0 ? history.reduce((sum, entry) => sum + entry.executionTime, 0) / total : 0;

	return {
		total,
		successful,
		failed,
		successRate: total > 0 ? (successful / total) * 100 : 0,
		avgExecutionTime,
	};
};

// Validate command history entry
export const validateCommandHistoryEntry = (entry: CommandHistoryEntry): Result<CommandHistoryEntry> => {
	if (!entry.id || entry.id.trim().length === 0) {
		return { success: false, error: new Error("Entry ID is required") };
	}

	if (!entry.commandId || entry.commandId.trim().length === 0) {
		return { success: false, error: new Error("Command ID is required") };
	}

	if (!entry.executedAt) {
		return {
			success: false,
			error: new Error("Executed at timestamp is required"),
		};
	}

	if (entry.executionTime < 0) {
		return {
			success: false,
			error: new Error("Execution time must be non-negative"),
		};
	}

	return { success: true, data: entry };
};
