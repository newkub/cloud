import type { SnippetFormActionsProps, SnippetFormInputProps } from "./types";

export function SnippetFormInput(props: SnippetFormInputProps) {
	return (
		<div class="form-group">
			<label for={props.id}>{props.label}</label>
			{props.type === "textarea" ? (
				<textarea
					id={props.id}
					value={props.value()}
					onInput={(e) => props.onInput(e.currentTarget.value)}
					required={props.required}
					rows={props.rows ?? 4}
				/>
			) : (
				<input
					id={props.id}
					type={props.type ?? "text"}
					value={props.value()}
					onInput={(e) => props.onInput(e.currentTarget.value)}
					required={props.required}
				/>
			)}
		</div>
	);
}

export function SnippetFormActions(props: SnippetFormActionsProps) {
	return (
		<div class="form-actions">
			<button type="submit" class="submit-button">
				{props.submitLabel}
			</button>
			<button type="button" class="cancel-button" onClick={props.onCancel}>
				Cancel
			</button>
		</div>
	);
}
