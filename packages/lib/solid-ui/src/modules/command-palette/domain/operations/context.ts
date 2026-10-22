/**
 * Context Operations - Domain operations for command context awareness
 * Pure functions for managing command context and contextual suggestions
 */

import type { Command } from "../../types";

export interface DomainCommandContext {
	readonly url?: string;
	readonly selection?: string;
	readonly element?: string;
	readonly application?: string;
	readonly platform?: string;
	readonly timestamp: Date;
}

export interface DomainContextualCommand extends Command {
	readonly relevanceScore: number;
}

/**
 * Create initial context
 */
export const createInitialContext = (): DomainCommandContext => ({
	timestamp: new Date(),
});

/**
 * Update context with new information
 */
export const updateContext = (
	context: DomainCommandContext,
	updates: Partial<DomainCommandContext>,
): DomainCommandContext => ({
	...context,
	...updates,
	timestamp: new Date(),
});

/**
 * Check if command matches current context
 */
export const matchCommandContext = (command: Command, context: DomainCommandContext): boolean => {
	// Check if command has context-specific requirements
	if (!command.category) return true;

	// Simple matching based on category and URL
	if (context.url && command.category === "navigation") {
		return true;
	}

	if (context.selection && command.category === "text") {
		return true;
	}

	return true; // Default to showing command
};

/**
 * Match command with context and calculate relevance
 */
export const matchCommandWithContext = (command: Command, context: DomainCommandContext): DomainContextualCommand => {
	let relevanceScore = 0.5; // Base score

	// Boost score for context-aware commands
	if (context.url && command.category === "navigation") {
		relevanceScore += 0.3;
	}

	if (context.selection && command.category === "text") {
		relevanceScore += 0.3;
	}

	// Boost recently used commands
	if (command.lastExecutedAt) {
		const daysSinceLastUse = (Date.now() - new Date(command.lastExecutedAt).getTime()) / (1000 * 60 * 60 * 24);
		if (daysSinceLastUse < 1) {
			relevanceScore += 0.2;
		}
	}

	// Boost favorites
	if (command.isFavorite) {
		relevanceScore += 0.2;
	}

	return {
		...command,
		relevanceScore: Math.min(relevanceScore, 1),
	};
};

/**
 * Filter commands by context
 */
export const filterCommandsByContext = (
	commands: readonly Command[],
	context: DomainCommandContext,
): readonly Command[] => {
	return commands.filter((cmd) => matchCommandContext(cmd, context));
};

/**
 * Get contextual commands with relevance scores
 */
export const getContextualCommands = (
	commands: readonly Command[],
	context: DomainCommandContext,
): readonly DomainContextualCommand[] => {
	const contextualCommands = commands
		.filter((cmd) => matchCommandContext(cmd, context))
		.map((cmd) => matchCommandWithContext(cmd, context));

	// Sort by relevance score
	return contextualCommands.sort((a, b) => b.relevanceScore - a.relevanceScore);
};
