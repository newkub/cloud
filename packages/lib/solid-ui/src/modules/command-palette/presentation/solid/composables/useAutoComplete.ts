/**
 * useAutoComplete - Auto-complete suggestions for command palette
 */

import { createMemo } from "solid-js";
import type { AutoCompleteContext, AutoCompleteSuggestion, Command } from "../../../types";

export function useAutoComplete(
	commands: () => readonly Command[],
	searchQuery: () => string,
	maxSuggestions: number = 5,
) {
	const suggestions = createMemo<readonly AutoCompleteSuggestion[]>(() => {
		const query = searchQuery().toLowerCase();
		if (!query || query.length < 2) return [];

		const results: AutoCompleteSuggestion[] = [];

		// Add command suggestions
		for (const command of commands()) {
			const label = command.label.toLowerCase();
			const description = command.description?.toLowerCase() || "";
			const keywords = command.keywords?.map((k) => k.toLowerCase()) || [];

			// Calculate score based on match position
			let score = 0;
			if (label.startsWith(query)) score += 10;
			else if (label.includes(query)) score += 5;
			if (description.includes(query)) score += 3;
			if (keywords.some((k) => k.includes(query))) score += 2;

			if (score > 0) {
				results.push({
					id: command.id,
					text: command.label,
					type: "command",
					score,
					metadata: { commandId: command.id },
				});
			}

			if (results.length >= maxSuggestions) break;
		}

		// Sort by score (highest first)
		return results.sort((a, b) => b.score - a.score);
	});

	const context = createMemo<AutoCompleteContext>(() => ({
		query: searchQuery(),
		cursor: searchQuery().length,
		suggestions: suggestions(),
	}));

	return {
		suggestions,
		context,
	};
}
