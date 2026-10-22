/**
 * AI Search Operations - Domain operations for AI-powered search
 */

import type { Result } from "../../../shared/types";
import type { Command } from "../../../types/command";
import type {
	AISearchContext,
	AISearchOptions,
	AISearchRequest,
	AISearchResponse,
	AISuggestion,
} from "../../../types/search/ai-search";

// Build AI search request from query and context
export const buildAISearchRequest = (
	query: string,
	context?: AISearchContext,
	options?: AISearchOptions,
): Result<AISearchRequest> => {
	if (!query || query.trim().length === 0) {
		return { success: false, error: new Error("Query is required") };
	}

	const request: AISearchRequest = {
		query: query.trim(),
		context,
		options: {
			maxResults: options?.maxResults ?? 10,
			confidenceThreshold: options?.confidenceThreshold ?? 0.5,
			includeReasoning: options?.includeReasoning ?? false,
			language: options?.language ?? "en",
		},
	};

	return { success: true, data: request };
};

// Process AI search response to extract suggestions
export const processAISearchResponse = (
	response: AISearchResponse,
	commands: readonly Command[],
): Result<readonly Command[]> => {
	const validCommands = response.suggestions
		.map((suggestion) => {
			const command = commands.find((c) => c.id === suggestion.commandId);
			if (!command) {
				return null;
			}
			return command;
		})
		.filter((c): c is Command => c !== null);

	return { success: true, data: validCommands };
};

// Calculate relevance score for command matching
export const calculateRelevanceScore = (command: Command, query: string, context?: AISearchContext): number => {
	const lowerQuery = query.toLowerCase();
	let score = 0;

	// Label match (highest weight)
	if (command.label.toLowerCase().includes(lowerQuery)) {
		score += 0.5;
	}

	// Description match
	if (command.description?.toLowerCase().includes(lowerQuery)) {
		score += 0.3;
	}

	// Keywords match
	if (command.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery))) {
		score += 0.2;
	}

	// Context boost
	if (context?.currentRoute && command.category === context.currentRoute) {
		score += 0.1;
	}

	// Recent commands boost
	if (context?.recentCommands?.includes(command.id) || context?.recentCommands?.includes(command.label)) {
		score += 0.15;
	}

	return Math.min(score, 1);
};

// Sort suggestions by relevance score
export const sortSuggestionsByRelevance = (suggestions: readonly AISuggestion[]): readonly AISuggestion[] => {
	return [...suggestions].sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Filter suggestions by confidence threshold
export const filterSuggestionsByConfidence = (
	suggestions: readonly AISuggestion[],
	threshold: number,
): readonly AISuggestion[] => {
	return suggestions.filter((s) => s.relevanceScore >= threshold);
};

// AI search operation
export const performAISearch = async (
	commands: readonly Command[],
	query: string,
	context?: AISearchContext,
	options?: AISearchOptions,
): Promise<AISearchResponse> => {
	const requestResult = buildAISearchRequest(query, context, options);
	if (!requestResult.success) {
		throw requestResult.error;
	}

	// Calculate relevance scores locally (fallback if AI API unavailable)
	const suggestions = commands.map((command) => ({
		commandId: command.id,
		command,
		relevanceScore: calculateRelevanceScore(command, query, context),
		matchedKeywords: command.keywords?.filter((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
	}));

	const filteredSuggestions = filterSuggestionsByConfidence(suggestions, options?.confidenceThreshold ?? 0.5);

	const sortedSuggestions = sortSuggestionsByRelevance(filteredSuggestions);

	const response: AISearchResponse = {
		suggestions: sortedSuggestions.slice(0, options?.maxResults ?? 10),
		confidence: Math.max(...sortedSuggestions.map((s) => s.relevanceScore)),
		processedQuery: query,
	};

	return response;
};
