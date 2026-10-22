/**
 * Auto-complete Types
 */

export interface AutoCompleteSuggestion {
	readonly id: string;
	readonly text: string;
	readonly type: "command" | "keyword" | "category";
	readonly score: number;
	readonly metadata?: Record<string, unknown>;
}

export interface AutoCompleteContext {
	readonly query: string;
	readonly cursor: number;
	readonly suggestions: readonly AutoCompleteSuggestion[];
}

export interface AutoCompleteOptions {
	readonly maxSuggestions: number;
	readonly includeRecent: boolean;
	readonly includeCommands: boolean;
}
