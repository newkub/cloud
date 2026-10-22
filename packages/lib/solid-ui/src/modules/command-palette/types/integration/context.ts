/**
 * Context Types - Domain types for context-aware commands
 */

import type { Command } from "../command";

// Context types
export interface CommandContext {
	readonly route?: string;
	readonly component?: string;
	readonly state?: Record<string, unknown>;
	readonly userRole?: string;
	readonly permissions?: readonly string[];
	readonly metadata?: Record<string, unknown>;
}

export interface ContextualCommand extends Command {
	readonly contexts?: readonly CommandContext[];
	readonly contextMatchStrategy?: "any" | "all" | "exact";
}

export interface ContextFilter {
	readonly route?: string;
	readonly component?: string;
	readonly state?: Record<string, unknown>;
	readonly userRole?: string;
	readonly permissions?: readonly string[];
}

// Context matching result
export interface ContextMatchResult {
	readonly command: Command;
	readonly matches: boolean;
	readonly score: number;
	readonly matchedContexts?: readonly CommandContext[];
}

// Context state
export interface ContextState {
	readonly currentContext: CommandContext;
	readonly history: readonly CommandContext[];
	readonly lastUpdated: Date;
}
