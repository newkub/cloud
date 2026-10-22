/**
 * useSnippets - SolidJS composable for snippet management
 */

import { createSignal } from "solid-js";
import {
	addSnippetToStorage,
	createSnippetStorage,
	deleteSnippetFromStorage,
	getSnippetLibrary,
	searchSnippetsInStorage,
	updateSnippetInStorage,
} from "../../../adapters/storage/snippet-storage";
import type { Snippet } from "../../../types";

export function useSnippets() {
	let snippetState = createSnippetStorage();
	const [library, setLibrary] = createSignal(getSnippetLibrary(snippetState));

	const snippets = () => library().snippets;

	const addSnippet = (snippet: Omit<Snippet, "id" | "createdAt">) => {
		snippetState = addSnippetToStorage(snippetState, snippet);
		setLibrary(getSnippetLibrary(snippetState));
	};

	const updateSnippet = (id: string, snippet: Partial<Snippet>) => {
		snippetState = updateSnippetInStorage(snippetState, id, snippet);
		setLibrary(getSnippetLibrary(snippetState));
	};

	const deleteSnippet = (id: string) => {
		snippetState = deleteSnippetFromStorage(snippetState, id);
		setLibrary(getSnippetLibrary(snippetState));
	};

	const searchSnippets = (query: string) => {
		return searchSnippetsInStorage(snippetState, query);
	};

	return {
		library,
		snippets,
		addSnippet,
		updateSnippet,
		deleteSnippet,
		searchSnippets,
	};
}
