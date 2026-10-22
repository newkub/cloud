/**
 * CommandSearchService - Domain service for command search logic (Functional style)
 * Pure business logic without external dependencies
 */

import type { SearchOptions, SearchResult } from "../../../ports/search/command-searcher";
import type { Command } from "../../../types";
import { DEFAULT_MAX_RESULTS, DEFAULT_SEARCH_THRESHOLD } from "../../constants";

export const searchCommands = (commands: readonly Command[], options: SearchOptions): SearchResult => {
	const { query, limit = DEFAULT_MAX_RESULTS, threshold = DEFAULT_SEARCH_THRESHOLD } = options;

	if (!query || query.trim().length === 0) {
		return {
			commands: commands.slice(0, limit),
			total: commands.length,
		};
	}

	const lowerQuery = query.toLowerCase();
	const scored = commands.map((command) => ({
		command,
		score: calculateScore(command, lowerQuery),
	}));

	const filtered = scored
		.filter(({ score }) => score >= threshold)
		.sort((a, b) => b.score - a.score)
		.map(({ command }) => command);

	return {
		commands: filtered.slice(0, limit),
		total: filtered.length,
	};
};

const calculateScore = (command: Command, query: string): number => {
	const label = command.label.toLowerCase();
	const description = command.description?.toLowerCase() || "";
	const keywords = command.keywords?.map((k) => k.toLowerCase()) || [];

	let score = 0;

	// Exact label match
	if (label === query) score += 1.0;

	// Label starts with query
	if (label.startsWith(query)) score += 0.8;

	// Label contains query
	if (label.includes(query)) score += 0.6;

	// Description contains query
	if (description.includes(query)) score += 0.4;

	// Keywords match
	for (const keyword of keywords) {
		if (keyword.includes(query)) score += 0.5;
	}

	return score;
};
