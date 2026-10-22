import { For } from "solid-js";
import type { SnippetControlsProps } from "./types";

export function SnippetControls(props: SnippetControlsProps) {
	return (
		<div class="snippet-controls">
			<input
				type="text"
				value={props.searchQuery()}
				onInput={(e) => props.setSearchQuery(e.currentTarget.value)}
				placeholder="Search snippets..."
				class="search-input"
			/>
			<select
				value={props.selectedCategory()}
				onChange={(e) => props.setSelectedCategory(e.currentTarget.value)}
				class="category-select"
			>
				<option value="all">All Categories</option>
				<For each={props.categories()}>{(category) => <option value={category}>{category}</option>}</For>
			</select>
		</div>
	);
}
