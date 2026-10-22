/**
 * Storage Adapters - Storage implementations
 * Functional implementations of storage ports
 */

export {
	addClipboardEntryToStorage,
	clearClipboardHistory,
	copyToClipboard,
	createClipboardStorage,
	getClipboardHistory,
	getRecentClipboardEntriesFromStorage,
} from "./clipboard-storage";
export { createLocalStorageAdapter } from "./local-storage-adapter";
export {
	addSnippetToStorage,
	createSnippetStorage,
	deleteSnippetFromStorage,
	getSnippetLibrary,
	searchSnippetsInStorage,
	updateSnippetInStorage,
} from "./snippet-storage";
