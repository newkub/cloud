/**
 * Clipboard Operations - Domain operations for clipboard history
 */

import type { Result } from "../../../shared/types";
import type { ClipboardEntry, ClipboardHistory } from "../../../types/integration/clipboard";

// Create clipboard entry
export const createClipboardEntry = (
	content: string,
	type: ClipboardEntry["type"] = "text",
	metadata?: Record<string, unknown>,
): Result<ClipboardEntry> => {
	if (!content || content.trim().length === 0) {
		return { success: false, error: new Error("Content is required") };
	}

	const entry: ClipboardEntry = {
		id: `clipboard-${Date.now()}`,
		content,
		type,
		timestamp: new Date(),
		metadata,
	};

	return { success: true, data: entry };
};

// Add entry to history
export const addToClipboardHistory = (
	history: ClipboardHistory,
	entry: ClipboardEntry,
	maxEntries = 50,
): Result<ClipboardHistory> => {
	const newHistory = [entry, ...history];

	// Limit history size
	if (newHistory.length > maxEntries) {
		return { success: true, data: newHistory.slice(0, maxEntries) };
	}

	return { success: true, data: newHistory };
};

// Remove entry from history
export const removeFromClipboardHistory = (history: ClipboardHistory, entryId: string): Result<ClipboardHistory> => {
	const newHistory = history.filter((entry) => entry.id !== entryId);
	return { success: true, data: newHistory };
};

// Clear clipboard history
export const clearClipboardHistory = (): Result<ClipboardHistory> => {
	return { success: true, data: [] };
};

// Search clipboard history
export const searchClipboardHistory = (history: ClipboardHistory, query: string): Result<readonly ClipboardEntry[]> => {
	if (!query || query.trim().length === 0) {
		return { success: true, data: history };
	}

	const lowerQuery = query.toLowerCase();
	const results = history.filter((entry) => entry.content.toLowerCase().includes(lowerQuery));

	return { success: true, data: results };
};

// Filter by type
export const filterClipboardHistoryByType = (
	history: ClipboardHistory,
	type: ClipboardEntry["type"],
): Result<readonly ClipboardEntry[]> => {
	const results = history.filter((entry) => entry.type === type);
	return { success: true, data: results };
};

// Validate clipboard entry
export const validateClipboardEntry = (entry: ClipboardEntry): Result<ClipboardEntry> => {
	if (!entry.id || entry.id.trim().length === 0) {
		return { success: false, error: new Error("Entry ID is required") };
	}

	if (!entry.content || entry.content.trim().length === 0) {
		return { success: false, error: new Error("Content is required") };
	}

	if (!entry.type) {
		return { success: false, error: new Error("Type is required") };
	}

	if (!["text", "image", "file"].includes(entry.type)) {
		return {
			success: false,
			error: new Error(`Invalid type: ${entry.type}`),
		};
	}

	if (!entry.timestamp) {
		return { success: false, error: new Error("Timestamp is required") };
	}

	return { success: true, data: entry };
};
