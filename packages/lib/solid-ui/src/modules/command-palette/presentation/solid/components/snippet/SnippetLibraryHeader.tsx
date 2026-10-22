import type { SnippetLibraryHeaderProps } from "./types";

export function SnippetLibraryHeader(props: SnippetLibraryHeaderProps) {
	return (
		<div class="snippet-header">
			<h2 class="snippet-title">Snippet Library</h2>
			<button class="create-button" onClick={props.onCreate} type="button">
				+ New Snippet
			</button>
		</div>
	);
}
