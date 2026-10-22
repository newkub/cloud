/**
 * SnippetLibrary - SolidJS component for command palette snippet library
 */

import { splitProps } from "solid-js";
import { createSnippetLibraryState } from "./handlers";
import { SnippetControls } from "./SnippetControls";
import { SnippetLibraryHeader } from "./SnippetLibraryHeader";
import { SnippetLibraryModals } from "./SnippetLibraryModals";
import { SnippetList } from "./SnippetList";
import type { SnippetLibraryProps } from "./types";

export function SnippetLibrary(props: SnippetLibraryProps) {
	const [local] = splitProps(props, [
		"snippets",
		"onCreateSnippet",
		"onEditSnippet",
		"onDeleteSnippet",
		"onSearchSnippets",
	]);
	const state = createSnippetLibraryState(local);

	return (
		<div class="snippet-library">
			<SnippetLibraryHeader onCreate={() => state.setIsCreating(true)} />

			<SnippetControls
				searchQuery={state.searchQuery}
				setSearchQuery={state.setSearchQuery}
				selectedCategory={state.selectedCategory}
				setSelectedCategory={state.setSelectedCategory}
				categories={state.categories}
			/>

			<SnippetList
				snippets={state.filteredSnippets}
				onEdit={state.setEditingSnippet}
				onDelete={state.handleDeleteSnippet}
				isEmpty={state.filteredSnippets().length === 0}
				emptyMessage={
					local.snippets.length === 0
						? "No snippets yet. Create your first snippet."
						: "No snippets match the current filters"
				}
			/>

			<SnippetLibraryModals
				isCreating={state.isCreating}
				editingSnippet={state.editingSnippet}
				onCreateSubmit={state.handleCreateSnippet}
				onCreateCancel={() => state.setIsCreating(false)}
				onEditSubmit={state.handleEditSnippet}
				onEditCancel={() => state.setEditingSnippet(null)}
			/>
		</div>
	);
}
