import { Show } from "solid-js";
import type { Snippet } from "../../../../types";
import { CreateSnippetForm, EditSnippetForm } from "./SnippetLibraryForms";
import type { SnippetLibraryModalsProps } from "./types";

export function SnippetLibraryModals(props: SnippetLibraryModalsProps) {
	return (
		<>
			<Show when={props.isCreating()}>
				<div class="snippet-modal">
					<h3 class="modal-title">Create New Snippet</h3>
					<CreateSnippetForm onSubmit={props.onCreateSubmit} onCancel={props.onCreateCancel} />
				</div>
			</Show>

			<Show when={props.editingSnippet()}>
				<div class="snippet-modal">
					<h3 class="modal-title">Edit Snippet</h3>
					<EditSnippetForm
						snippet={props.editingSnippet() as Snippet}
						onSubmit={props.onEditSubmit}
						onCancel={props.onEditCancel}
					/>
				</div>
			</Show>
		</>
	);
}
