import { For, Show } from "solid-js";
import { SnippetCard } from "./SnippetCard";
import type { SnippetListProps } from "./types";

export function SnippetList(props: SnippetListProps) {
	return (
		<div class="snippet-list">
			<For each={props.snippets()}>
				{(snippet) => <SnippetCard snippet={snippet} onEdit={props.onEdit} onDelete={props.onDelete} />}
			</For>
			<Show when={props.isEmpty}>
				<div class="empty-state">{props.emptyMessage}</div>
			</Show>
		</div>
	);
}
