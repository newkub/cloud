/**
 * CustomCommandSearcher - Custom fuzzy search implementation (No external dependencies)
 */

import { DEFAULT_SEARCH_THRESHOLD } from "../../domain/constants";
import type { CacheConfig, SearchCacheState } from "../../domain/operations/performance";
import { createCacheState } from "../../domain/operations/performance";
import type { SearchOptions, SearchResult } from "../../ports/search/command-searcher";
import type { Command } from "../../types";

export type CustomCommandSearcherState = Readonly<{
	commands: readonly Command[];
	cache: SearchCacheState;
}>;

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];

	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
			}
		}
	}
	return matrix[b.length][a.length];
}

/**
 * Calculate fuzzy match score (0-1, where 1 is perfect match)
 */
function fuzzyMatchScore(query: string, text: string): number {
	if (!query || !text) return 0;
	if (query === text) return 1;

	const queryLower = query.toLowerCase();
	const textLower = text.toLowerCase();

	// Exact match
	if (queryLower === textLower) return 1;

	// Contains match
	if (textLower.includes(queryLower)) {
		return 0.9;
	}

	// Fuzzy match using Levenshtein distance
	const distance = levenshteinDistance(queryLower, textLower);
	const maxLen = Math.max(queryLower.length, textLower.length);
	const similarity = 1 - distance / maxLen;

	return similarity;
}

/**
 * Calculate weighted score for a command
 */
function calculateCommandScore(command: Command, query: string): { score: number; command: Command } {
	const labelScore = fuzzyMatchScore(query, command.label) * 0.7;
	const descriptionScore = fuzzyMatchScore(query, command.description || "") * 0.2;
	const keywordsScore = fuzzyMatchScore(query, (command.keywords || []).join(" ")) * 0.1;

	const totalScore = labelScore + descriptionScore + keywordsScore;

	return { score: 1 - totalScore, command }; // Convert to distance (lower is better)
}

export const createCustomCommandSearcher = (
	commands: readonly Command[],
	cacheConfig?: CacheConfig,
): CustomCommandSearcherState => {
	const cache = cacheConfig ? createCacheState(cacheConfig) : createCacheState({ maxSize: 100, ttl: 300000 }); // 5 minutes default

	return {
		commands,
		cache,
	};
};

export const searchWithCustom = async (
	_state: CustomCommandSearcherState,
	commands: readonly Command[],
	options: SearchOptions,
): Promise<SearchResult> => {
	const { query, limit } = options;

	if (!query || query.trim().length === 0) {
		return {
			commands: commands.slice(0, limit),
			total: commands.length,
		};
	}

	// Calculate scores for all commands
	const scoredCommands = commands.map((command) => calculateCommandScore(command, query));

	// Filter by threshold
	const threshold = options.threshold ?? DEFAULT_SEARCH_THRESHOLD;
	const filtered = scoredCommands.filter((result) => result.score <= threshold);

	// Sort by score (lower is better) and then by execution count
	const sortedResults = filtered.sort((a, b) => {
		const scoreDiff = a.score - b.score;
		if (scoreDiff !== 0) return scoreDiff;

		// Secondary sort by execution count (recently used commands first)
		const aExecCount = a.command.executionCount || 0;
		const bExecCount = b.command.executionCount || 0;
		return bExecCount - aExecCount;
	});

	const finalCommands = sortedResults.map((result) => result.command);

	return {
		commands: finalCommands.slice(0, limit),
		total: finalCommands.length,
	};
};
