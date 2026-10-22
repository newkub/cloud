/**
 * AI Searcher Port - Interface for AI-powered natural language search
 */

import type { Command } from "../../types";
import type { AISearchRequest, AISearchResponse } from "../../types/search/ai-search";

export interface AISearcher {
	search(commands: readonly Command[], request: AISearchRequest): Promise<AISearchResponse>;
}

export interface AISearcherConfig {
	readonly provider: "openai" | "anthropic" | "custom";
	readonly apiKey: string;
	readonly model?: string;
	readonly endpoint?: string;
	readonly maxTokens?: number;
	readonly temperature?: number;
}
