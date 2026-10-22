/**
 * useClipboard - SolidJS composable for clipboard management
 */

import { createSignal } from "solid-js";
import {
	clearClipboardHistory,
	createClipboardStorage,
	getRecentClipboardEntriesFromStorage,
	copyToClipboard as storageCopyToClipboard,
} from "../../../adapters/storage/clipboard-storage";
import { createLocalStorageAdapter } from "../../../adapters/storage/local-storage-adapter";
import { DEFAULT_HISTORY_LIMIT } from "../../../domain/constants";

export function useClipboard() {
	const storage = createLocalStorageAdapter();
	let clipboardState = createClipboardStorage(storage);
	const [history, setHistory] = createSignal<{ content: string; timestamp: Date }[]>([]);

	const recentEntries = () => getRecentClipboardEntriesFromStorage(clipboardState, DEFAULT_HISTORY_LIMIT);

	const copyToClipboard = async (content: string) => {
		clipboardState = await storageCopyToClipboard(clipboardState, content);
		setHistory([...history(), { content, timestamp: new Date() }]);
	};

	const clearHistory = () => {
		clipboardState = clearClipboardHistory(clipboardState);
		setHistory([]);
	};

	return {
		history,
		recentEntries,
		copyToClipboard,
		clearHistory,
	};
}
