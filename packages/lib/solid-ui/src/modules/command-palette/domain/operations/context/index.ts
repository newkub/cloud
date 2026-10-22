/**
 * Context Operations - Domain operations for context-aware commands
 */

import type { Command } from "../../../types/command";
import type { CommandContext, ContextFilter, ContextMatchResult } from "../../../types/integration/context";

// Match command against context filter
export const matchCommandContext = (command: Command, filter: ContextFilter): ContextMatchResult => {
	let score = 0;
	const matchedContexts: CommandContext[] = [];

	// Route match
	if (filter.route && command.category === filter.route) {
		score += 0.4;
		matchedContexts.push({ route: filter.route });
	}

	// Component match
	if (filter.component && command.description?.includes(filter.component)) {
		score += 0.3;
		matchedContexts.push({ component: filter.component });
	}

	// State match (if command has metadata matching state)
	if (filter.state) {
		const stateKeys = Object.keys(filter.state);
		const matchesState = stateKeys.some((key) => {
			const commandValue = command[key as keyof Command];
			return commandValue === filter.state?.[key];
		});
		if (matchesState) {
			score += 0.2;
			matchedContexts.push({ state: filter.state });
		}
	}

	// User role match
	if (filter.userRole) {
		// Assume commands have role metadata in description or keywords
		const hasRole =
			command.description?.toLowerCase().includes(filter.userRole?.toLowerCase() ?? "") ||
			command.keywords?.some((k) => k.toLowerCase().includes(filter.userRole?.toLowerCase() ?? ""));
		if (hasRole) {
			score += 0.1;
			matchedContexts.push({ userRole: filter.userRole });
		}
	}

	return {
		command,
		matches: score > 0,
		score,
		matchedContexts: matchedContexts.length > 0 ? matchedContexts : undefined,
	};
};

// Filter commands by context
export const filterCommandsByContext = (commands: readonly Command[], filter: ContextFilter): readonly Command[] => {
	const results = commands.map((command) => matchCommandContext(command, filter));

	return results
		.filter((result) => result.matches)
		.sort((a, b) => b.score - a.score)
		.map((result) => result.command);
};

// Update context state
export const updateContext = (currentContext: CommandContext, updates: Partial<CommandContext>): CommandContext => ({
	...currentContext,
	...updates,
});

// Create initial context
export const createInitialContext = (route?: string, component?: string): CommandContext => ({
	route,
	component,
	state: {},
	userRole: undefined,
	permissions: [],
	metadata: {},
});
