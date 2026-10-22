/**
 * ClipboardStorage - Storage implementation for clipboard history using IStorage port
 */

import type { ClipboardHistory } from "../../types";
import { addClipboardEntry, createClipboardHistory, getRecentClipboardEntries } from "../../types";
import type { ClipboardEntry } from "../../types/integration/clipboard";
import type { IStorage } from "./local-storage-adapter";

export type ClipboardStorageState = Readonly<{
	history: ClipboardHistory;
	storageKey: string;
	storage: IStorage;
}>;

export const createClipboardStorage = (
	storage: IStorage,
	storageKey: string = "command-palette-clipboard",
): ClipboardStorageState => ({
	history: loadHistory(storage, storageKey),
	storageKey,
	storage,
});

export const getClipboardHistory = (state: ClipboardStorageState): ClipboardHistory => state.history;

export const addClipboardEntryToStorage = (
	state: ClipboardStorageState,
	content: string,
	type: ClipboardEntry["type"] = "text",
): ClipboardStorageState => {
	const newHistory = addClipboardEntry(state.history, content, type);
	saveHistory(state.storage, state.storageKey, newHistory);
	return { ...state, history: newHistory };
};

export const clearClipboardHistory = (state: ClipboardStorageState): ClipboardStorageState => {
	const newHistory = createClipboardHistory();
	saveHistory(state.storage, state.storageKey, newHistory);
	return { ...state, history: newHistory };
};

export const getRecentClipboardEntriesFromStorage = (
	state: ClipboardStorageState,
	limit?: number,
): readonly ClipboardEntry[] => {
	return getRecentClipboardEntries(state.history, limit);
};

export const copyToClipboard = async (
	state: ClipboardStorageState,
	content: string,
): Promise<ClipboardStorageState> => {
	await navigator.clipboard.writeText(content);
	return addClipboardEntryToStorage(state, content);
};

const loadHistory = (storage: IStorage, storageKey: string): ClipboardHistory => {
	const stored = storage.get(storageKey);
	if (stored.success && stored.data) {
		return stored.data as ClipboardHistory;
	}
	return createClipboardHistory();
};

const saveHistory = (storage: IStorage, storageKey: string, history: ClipboardHistory): void => {
	storage.set(storageKey, history);
};
