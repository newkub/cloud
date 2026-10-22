import type { Snippet } from "../../../../types";
import type { SnippetFormData, SnippetFormValues } from "./types";

export function matchesSearch(snippet: Snippet, query: string): boolean {
	if (!query) return true;
	const lower = query.toLowerCase();
	return (
		snippet.name.toLowerCase().includes(lower) ||
		snippet.content.toLowerCase().includes(lower) ||
		snippet.keywords?.some((k) => k.toLowerCase().includes(lower)) === true
	);
}

export function matchesCategory(snippet: Snippet, category: string): boolean {
	return category === "all" || snippet.category === category;
}

export function filterSnippets(snippets: readonly Snippet[], query: string, category: string): readonly Snippet[] {
	return snippets.filter((snippet) => matchesSearch(snippet, query) && matchesCategory(snippet, category));
}

export function extractCategories(snippets: readonly Snippet[]): readonly string[] {
	const cats = new Set(snippets.map((s) => s.category).filter(Boolean));
	return Array.from(cats) as string[];
}

export function parseKeywords(value: string): readonly string[] {
	return value
		.split(",")
		.map((k) => k.trim())
		.filter(Boolean);
}

export function buildCreateSnippet(values: SnippetFormValues): SnippetFormData {
	const keywords = parseKeywords(values.keywords);
	return {
		name: values.name,
		content: values.content,
		...(values.description ? { description: values.description } : {}),
		...(values.category ? { category: values.category } : {}),
		...(values.language ? { language: values.language } : {}),
		...(keywords.length > 0 ? { keywords } : {}),
	};
}

export function buildEditSnippet(snippet: Snippet, values: SnippetFormValues): Snippet {
	const keywords = parseKeywords(values.keywords);
	return {
		...snippet,
		name: values.name,
		content: values.content,
		...(values.description ? { description: values.description } : {}),
		...(values.category ? { category: values.category } : {}),
		...(values.language ? { language: values.language } : {}),
		...(keywords.length > 0 ? { keywords } : {}),
		updatedAt: new Date(),
	};
}
