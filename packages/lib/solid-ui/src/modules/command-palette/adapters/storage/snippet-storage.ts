/**
 * SnippetStorage - LocalStorage implementation for snippet library (Functional style)
 */

import type { Snippet, SnippetLibrary } from "../../types";
import { createSnippet, createSnippetLibrary, searchSnippets } from "../../types";

export type SnippetStorageState = Readonly<{
	library: SnippetLibrary;
	storageKey: string;
}>;

export const createSnippetStorage = (storageKey: string = "command-palette-snippets"): SnippetStorageState => ({
	library: loadLibrary(storageKey),
	storageKey,
});

export const getSnippetLibrary = (state: SnippetStorageState): SnippetLibrary => state.library;

export const addSnippetToStorage = (
	state: SnippetStorageState,
	snippet: Omit<Snippet, "id" | "createdAt">,
): SnippetStorageState => {
	const newSnippet = createSnippet(snippet);
	const newLibrary = {
		snippets: [...state.library.snippets, newSnippet],
	};
	saveLibrary(state.storageKey, newLibrary);
	return { ...state, library: newLibrary };
};

export const updateSnippetInStorage = (
	state: SnippetStorageState,
	id: string,
	snippet: Partial<Snippet>,
): SnippetStorageState => {
	const newLibrary = {
		snippets: state.library.snippets.map((s) => (s.id === id ? { ...s, ...snippet } : s)),
	};
	saveLibrary(state.storageKey, newLibrary);
	return { ...state, library: newLibrary };
};

export const deleteSnippetFromStorage = (state: SnippetStorageState, id: string): SnippetStorageState => {
	const newLibrary = {
		snippets: state.library.snippets.filter((s) => s.id !== id),
	};
	saveLibrary(state.storageKey, newLibrary);
	return { ...state, library: newLibrary };
};

export const searchSnippetsInStorage = (state: SnippetStorageState, query: string): readonly Snippet[] => {
	return searchSnippets(state.library, query);
};

const loadLibrary = (storageKey: string): SnippetLibrary => {
	try {
		const stored = localStorage.getItem(storageKey);
		if (stored) {
			const parsed = JSON.parse(stored);
			return {
				snippets: parsed.snippets.map((s: unknown) => ({
					...(s as Snippet),
					createdAt: new Date((s as { createdAt: string }).createdAt),
				})),
			};
		}
	} catch (_error) {}
	return createSnippetLibrary();
};

const saveLibrary = (storageKey: string, library: SnippetLibrary): void => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(library));
	} catch (_error) {}
};
