/**
 * AI Search Types - Domain types for AI-powered natural language search
 */

import type { Command } from "../command";

// AI search request types
export interface AISearchRequest {
	readonly query: string;
	readonly context?: AISearchContext;
	readonly options?: AISearchOptions;
}

export interface AISearchContext {
	readonly currentRoute?: string;
	readonly currentComponent?: string;
	readonly userPreferences?: readonly string[];
	readonly recentCommands?: readonly string[];
	readonly metadata?: Record<string, unknown>;
}

export interface AISearchOptions {
	readonly maxResults?: number;
	readonly confidenceThreshold?: number;
	readonly includeReasoning?: boolean;
	readonly language?: string;
}

// AI search response types
export interface AISearchResponse {
	readonly suggestions: readonly AISuggestion[];
	readonly reasoning?: string;
	readonly confidence: number;
	readonly processedQuery: string;
}

export interface AISuggestion {
	readonly commandId: string;
	readonly command: Command;
	readonly relevanceScore: number;
	readonly reasoning?: string;
	readonly matchedKeywords?: readonly string[];
}

// AI search error types
export interface AISearchError {
	readonly type: "api_error" | "rate_limit" | "invalid_response" | "network_error";
	readonly message: string;
	readonly retryable: boolean;
}

// AI provider types
export type AIProvider = "openai" | "anthropic" | "custom";

export interface AIProviderConfig {
	readonly provider: AIProvider;
	readonly apiKey: string;
	readonly model?: string;
	readonly endpoint?: string;
	readonly maxTokens?: number;
	readonly temperature?: number;
}

// AI search state types
export interface AISearchState {
	readonly isSearching: boolean;
	readonly lastQuery?: string;
	readonly lastResponse?: AISearchResponse;
	readonly error?: AISearchError;
	readonly searchCount: number;
}
