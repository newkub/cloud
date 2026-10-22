/**
 * Search and Filtering Types
 */

export interface CommandSearchQuery {
	readonly query: string;
	readonly category?: string;
	readonly enabled?: boolean;
	readonly limit?: number;
	readonly offset?: number;
	readonly filter?: CommandFilter;
}

export interface CommandFilter {
	readonly categories?: readonly string[];
	readonly enabled?: boolean;
	readonly hasKeywords?: boolean;
	readonly hasHotkey?: boolean;
}
