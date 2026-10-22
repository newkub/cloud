import type { Accessor } from "solid-js";
import type { Snippet } from "../../../../types";

export type SnippetFormData = Omit<Snippet, "id" | "createdAt" | "updatedAt">;

export interface SnippetFormValues {
	name: string;
	content: string;
	description: string;
	category: string;
	language: string;
	keywords: string;
}

export interface SnippetLibraryProps {
	snippets: readonly Snippet[];
	onCreateSnippet?: (snippet: SnippetFormData) => void;
	onEditSnippet?: (snippet: Snippet) => void;
	onDeleteSnippet?: (snippetId: string) => void;
	onSearchSnippets?: (query: string) => void;
}

export interface SnippetLibraryHeaderProps {
	onCreate: () => void;
}

export interface SnippetLibraryModalsProps {
	isCreating: Accessor<boolean>;
	editingSnippet: Accessor<Snippet | null>;
	onCreateSubmit: (snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt">) => void;
	onCreateCancel: () => void;
	onEditSubmit: (snippet: Snippet) => void;
	onEditCancel: () => void;
}

export interface SnippetCardProps {
	snippet: Snippet;
	onEdit: (snippet: Snippet) => void;
	onDelete: (snippetId: string) => void;
}

export interface SnippetControlsProps {
	searchQuery: Accessor<string>;
	setSearchQuery: (value: string) => void;
	selectedCategory: Accessor<string>;
	setSelectedCategory: (value: string) => void;
	categories: Accessor<readonly string[]>;
}

export interface SnippetListProps {
	snippets: Accessor<readonly Snippet[]>;
	onEdit: (snippet: Snippet) => void;
	onDelete: (snippetId: string) => void;
	isEmpty: boolean;
	emptyMessage: string;
}

export interface CreateSnippetFormProps {
	onSubmit: (snippet: SnippetFormData) => void;
	onCancel: () => void;
}

export interface EditSnippetFormProps {
	snippet: Snippet;
	onSubmit: (snippet: Snippet) => void;
	onCancel: () => void;
}

export interface SnippetFormProps {
	prefix: string;
	submitLabel: string;
	initialValues: SnippetFormValues;
	onSubmit: (values: SnippetFormValues) => void;
	onCancel: () => void;
}

export interface SnippetFormInputProps {
	id: string;
	label: string;
	value: Accessor<string>;
	onInput: (value: string) => void;
	type?: "text" | "textarea";
	required?: boolean;
	rows?: number;
}

export interface SnippetFormActionsProps {
	submitLabel: string;
	onCancel: () => void;
}
