/**
 * AI Command Searcher - Implementation using Effect and AI APIs
 */

import { performAISearch } from "../../domain/operations/ai";
import type { AISearcher, AISearcherConfig } from "../../ports/search/ai-searcher";
import type { Command } from "../../types";
import type { AISearchRequest, AISearchResponse } from "../../types/search/ai-search";

export type AICommandSearcherState = Readonly<{
	config: AISearcherConfig;
}>;

export const createAICommandSearcher = (config: AISearcherConfig): AICommandSearcherState => ({
	config,
});

export const searchWithAI = async (
	_state: AICommandSearcherState,
	commands: readonly Command[],
	request: AISearchRequest,
): Promise<AISearchResponse> => {
	const program = performAISearch(commands, request.query, request.context, request.options);

	const result = await program;

	return result;
};

// AI Searcher implementation
export const aiSearcher: AISearcher = {
	search: async (commands, request) => {
		const program = performAISearch(commands, request.query, request.context, request.options);

		return program;
	},
};
