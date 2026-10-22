import { SnippetForm } from "./SnippetForm";
import type { CreateSnippetFormProps, EditSnippetFormProps, SnippetFormValues } from "./types";
import { buildCreateSnippet, buildEditSnippet } from "./utils";

const createInitialValues: SnippetFormValues = {
	name: "",
	content: "",
	description: "",
	category: "",
	language: "",
	keywords: "",
};

export function CreateSnippetForm(props: CreateSnippetFormProps) {
	const handleSubmit = (values: SnippetFormValues) => {
		props.onSubmit(buildCreateSnippet(values));
	};

	return (
		<SnippetForm
			prefix="create-snippet"
			submitLabel="Create Snippet"
			initialValues={createInitialValues}
			onSubmit={handleSubmit}
			onCancel={props.onCancel}
		/>
	);
}

export function EditSnippetForm(props: EditSnippetFormProps) {
	const initialValues: SnippetFormValues = {
		name: props.snippet.name,
		content: props.snippet.content,
		description: props.snippet.description || "",
		category: props.snippet.category || "",
		language: props.snippet.language || "",
		keywords: props.snippet.keywords?.join(", ") || "",
	};

	const handleSubmit = (values: SnippetFormValues) => {
		props.onSubmit(buildEditSnippet(props.snippet, values));
	};

	return (
		<SnippetForm
			prefix="edit-snippet"
			submitLabel="Update Snippet"
			initialValues={initialValues}
			onSubmit={handleSubmit}
			onCancel={props.onCancel}
		/>
	);
}
