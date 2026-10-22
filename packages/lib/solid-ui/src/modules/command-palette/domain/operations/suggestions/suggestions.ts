/**
 * Suggestions Operations - Domain operations for command suggestions
 * Pure functions for generating context-based command suggestions
 */

import type { Command } from "../../../types";
import { getMostUsedCommands, getRecentlyUsedCommands } from "../analytics";
import type { DomainCommandContext } from "../context";
import { getContextualCommands } from "../context";

export interface Suggestion {
	readonly command: Command;
	readonly reason: string;
	readonly score: number;
}

/**
 * Generate suggestions based on context
 */
export const generateContextualSuggestions = (
	commands: readonly Command[],
	context: DomainCommandContext,
	limit: number = 5,
): readonly Suggestion[] => {
	const contextualCommands = getContextualCommands(commands, context);

	return contextualCommands.slice(0, limit).map((cmd) => ({
		command: cmd,
		reason: "Based on current context",
		score: cmd.relevanceScore,
	}));
};

/**
 * Generate suggestions based on recent usage
 */
export const generateRecentSuggestions = (commands: readonly Command[], limit: number = 5): readonly Suggestion[] => {
	const recentCommands = getRecentlyUsedCommands(commands, limit);

	return recentCommands.map((cmd) => ({
		command: cmd,
		reason: "Recently used",
		score: 0.8,
	}));
};

/**
 * Generate suggestions based on most used
 */
export const generatePopularSuggestions = (commands: readonly Command[], limit: number = 5): readonly Suggestion[] => {
	const popularCommands = getMostUsedCommands(commands, limit);

	return popularCommands.map((cmd) => ({
		command: cmd,
		reason: "Frequently used",
		score: 0.9,
	}));
};

/**
 * Generate suggestions based on favorites
 */
export const generateFavoriteSuggestions = (commands: readonly Command[], limit: number = 5): readonly Suggestion[] => {
	const favoriteCommands = commands.filter((cmd) => cmd.isFavorite).slice(0, limit);

	return favoriteCommands.map((cmd) => ({
		command: cmd,
		reason: "Favorite",
		score: 0.95,
	}));
};

/**
 * Generate mixed suggestions (combination of all strategies)
 */
export const generateMixedSuggestions = (
	commands: readonly Command[],
	context: DomainCommandContext,
	limit: number = 10,
): readonly Suggestion[] => {
	const suggestions: Suggestion[] = [];

	// Add contextual suggestions
	const contextual = generateContextualSuggestions(commands, context, 3);
	suggestions.push(...contextual);

	// Add recent suggestions
	const recent = generateRecentSuggestions(commands, 3);
	suggestions.push(...recent);

	// Add favorite suggestions
	const favorites = generateFavoriteSuggestions(commands, 2);
	suggestions.push(...favorites);

	// Add popular suggestions
	const popular = generatePopularSuggestions(commands, 2);
	suggestions.push(...popular);

	// Remove duplicates and sort by score
	const uniqueSuggestions = new Map<string, Suggestion>();
	for (const suggestion of suggestions) {
		const existing = uniqueSuggestions.get(suggestion.command.id);
		if (!existing || suggestion.score > existing.score) {
			uniqueSuggestions.set(suggestion.command.id, suggestion);
		}
	}

	return Array.from(uniqueSuggestions.values())
		.sort((a, b) => b.score - a.score)
		.slice(0, limit);
};

/**
 * Get suggestions for empty state
 */
export const getEmptyStateSuggestions = (
	commands: readonly Command[],
	context: DomainCommandContext,
): readonly Suggestion[] => {
	// Return a mix of popular and contextual suggestions
	return generateMixedSuggestions(commands, context, 5);
};

/**
 * Filter suggestions by query
 */
export const filterSuggestionsByQuery = (suggestions: readonly Suggestion[], query: string): readonly Suggestion[] => {
	if (!query) return suggestions;

	const lowerQuery = query.toLowerCase();
	return suggestions.filter((suggestion) => {
		const label = suggestion.command.label.toLowerCase();
		const description = suggestion.command.description?.toLowerCase() || "";
		const keywords = suggestion.command.keywords?.map((k) => k.toLowerCase()) || [];

		return (
			label.includes(lowerQuery) || description.includes(lowerQuery) || keywords.some((k) => k.includes(lowerQuery))
		);
	});
};
