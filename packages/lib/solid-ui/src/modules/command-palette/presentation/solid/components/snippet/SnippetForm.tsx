import { createSignal } from "solid-js";
import { SnippetFormActions, SnippetFormInput } from "./SnippetFormInputs";
import type { SnippetFormProps } from "./types";

export function SnippetForm(props: SnippetFormProps) {
	const [name, setName] = createSignal(props.initialValues.name);
	const [content, setContent] = createSignal(props.initialValues.content);
	const [description, setDescription] = createSignal(props.initialValues.description);
	const [category, setCategory] = createSignal(props.initialValues.category);
	const [language, setLanguage] = createSignal(props.initialValues.language);
	const [keywords, setKeywords] = createSignal(props.initialValues.keywords);

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		props.onSubmit({
			name: name(),
			content: content(),
			description: description(),
			category: category(),
			language: language(),
			keywords: keywords(),
		});
	};

	return (
		<form onSubmit={handleSubmit} class="snippet-form">
			<SnippetFormInput id={`${props.prefix}-name`} label="Name *" value={name} onInput={setName} required />
			<SnippetFormInput
				id={`${props.prefix}-content`}
				label="Content *"
				type="textarea"
				value={content}
				onInput={setContent}
				required
				rows={6}
			/>
			<SnippetFormInput
				id={`${props.prefix}-description`}
				label="Description"
				value={description}
				onInput={setDescription}
			/>
			<SnippetFormInput id={`${props.prefix}-category`} label="Category" value={category} onInput={setCategory} />
			<SnippetFormInput id={`${props.prefix}-language`} label="Language" value={language} onInput={setLanguage} />
			<SnippetFormInput
				id={`${props.prefix}-keywords`}
				label="Keywords (comma-separated)"
				value={keywords}
				onInput={setKeywords}
			/>
			<SnippetFormActions submitLabel={props.submitLabel} onCancel={props.onCancel} />
		</form>
	);
}
