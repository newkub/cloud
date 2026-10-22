import { createMemo, createSignal } from "solid-js";
import type { Snippet } from "../../../../types";
import type { SnippetFormData, SnippetLibraryProps } from "./types";
import { extractCategories, filterSnippets } from "./utils";

type SnippetLibraryLocal = Pick<
	SnippetLibraryProps,
	"snippets" | "onCreateSnippet" | "onEditSnippet" | "onDeleteSnippet"
>;

export function createSnippetLibraryState(local: SnippetLibraryLocal) {
	const [searchQuery, setSearchQuery] = createSignal("");
	const [selectedCategory, setSelectedCategory] = createSignal("all");
	const [isCreating, setIsCreating] = createSignal(false);
	const [editingSnippet, setEditingSnippet] = createSignal<Snippet | null>(null);

	const filteredSnippets = createMemo(() => filterSnippets(local.snippets, searchQuery(), selectedCategory()));
	const categories = createMemo(() => extractCategories(local.snippets));

	const handleCreateSnippet = (snippet: SnippetFormData) => {
		local.onCreateSnippet?.(snippet);
		setIsCreating(false);
	};

	const handleEditSnippet = (snippet: Snippet) => {
		local.onEditSnippet?.(snippet);
		setEditingSnippet(null);
	};

	const handleDeleteSnippet = (snippetId: string) => {
		local.onDeleteSnippet?.(snippetId);
	};

	return {
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		isCreating,
		setIsCreating,
		editingSnippet,
		setEditingSnippet,
		filteredSnippets,
		categories,
		handleCreateSnippet,
		handleEditSnippet,
		handleDeleteSnippet,
	};
}
