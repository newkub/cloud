/**
 * Snippet Types
 */

export interface Snippet {
	readonly id: string;
	readonly name: string;
	readonly content: string;
	readonly description?: string;
	readonly keywords?: readonly string[];
	readonly category?: string;
	readonly language?: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface SnippetLibrary {
	readonly snippets: readonly Snippet[];
}

export const createSnippet = (data: Omit<Snippet, "id" | "createdAt" | "updatedAt">): Snippet => ({
	...data,
	id: `snippet-${Date.now()}`,
	createdAt: new Date(),
	updatedAt: new Date(),
});

export const createSnippetLibrary = (snippets: readonly Snippet[] = []): SnippetLibrary => ({
	snippets,
});

export const searchSnippets = (library: SnippetLibrary, query: string): readonly Snippet[] => {
	const lowerQuery = query.toLowerCase();
	return library.snippets.filter(
		(snippet) =>
			snippet.name.toLowerCase().includes(lowerQuery) ||
			snippet.description?.toLowerCase().includes(lowerQuery) ||
			snippet.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery)),
	);
};
