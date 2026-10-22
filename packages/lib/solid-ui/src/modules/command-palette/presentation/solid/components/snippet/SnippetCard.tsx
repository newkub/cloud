import { For, Show } from "solid-js";
import type { SnippetCardProps } from "./types";

export function SnippetCard(props: SnippetCardProps) {
	return (
		<div class="snippet-card">
			<div class="snippet-header">
				<h3 class="snippet-name">{props.snippet.name}</h3>
				<Show when={props.snippet.category}>
					<span class="snippet-category">{props.snippet.category}</span>
				</Show>
				<Show when={props.snippet.language}>
					<span class="snippet-language">{props.snippet.language}</span>
				</Show>
			</div>

			<Show when={props.snippet.description}>
				<p class="snippet-description">{props.snippet.description}</p>
			</Show>

			<div class="snippet-content">
				<pre>
					<code>{props.snippet.content}</code>
				</pre>
			</div>

			<Show when={props.snippet.keywords && props.snippet.keywords.length > 0}>
				<div class="snippet-keywords">
					<For each={props.snippet.keywords}>{(keyword) => <span class="keyword-tag">{keyword}</span>}</For>
				</div>
			</Show>

			<div class="snippet-actions">
				<button class="action-button edit" onClick={() => props.onEdit(props.snippet)} type="button">
					Edit
				</button>
				<button class="action-button delete" onClick={() => props.onDelete(props.snippet.id)} type="button">
					Delete
				</button>
			</div>
		</div>
	);
}
