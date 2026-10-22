/**
 * Command Searcher Port - Interface for command search
 */

import type { Command } from "../../types";

export interface SearchOptions {
	readonly query: string;
	readonly limit?: number;
	readonly threshold?: number;
}

export interface SearchResult {
	readonly commands: Command[];
	readonly total: number;
}

export interface CommandSearcher {
	search(commands: readonly Command[], options: SearchOptions): Promise<SearchResult>;
}
