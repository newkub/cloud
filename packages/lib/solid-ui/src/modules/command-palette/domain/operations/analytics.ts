/**
 * Analytics Operations - Domain operations for command usage analytics
 * Pure functions for tracking and analyzing command usage
 */

import type { Command } from "../../types";

export interface AnalyticsEvent {
	readonly type: "execute" | "search" | "select" | "favorite" | "rate";
	readonly commandId: string;
	readonly timestamp: Date;
	readonly metadata?: Record<string, unknown>;
}

export interface AnalyticsStats {
	readonly totalExecutions: number;
	readonly totalSearches: number;
	readonly mostUsedCommands: readonly Command[];
	readonly averageExecutionsPerCommand: number;
	readonly usageByCategory: Readonly<Record<string, number>>;
}

/**
 * Track command execution
 */
export const trackExecution = (command: Command): Command => ({
	...command,
	executionCount: (command.executionCount || 0) + 1,
	lastExecutedAt: new Date().toISOString(),
});

/**
 * Get most used commands
 */
export const getMostUsedCommands = (commands: readonly Command[], limit: number = 10): readonly Command[] => {
	return [...commands]
		.filter((cmd) => cmd.executionCount && cmd.executionCount > 0)
		.sort((a, b) => (b.executionCount || 0) - (a.executionCount || 0))
		.slice(0, limit);
};

/**
 * Get recently used commands
 */
export const getRecentlyUsedCommands = (commands: readonly Command[], limit: number = 10): readonly Command[] => {
	return [...commands]
		.filter((cmd) => cmd.lastExecutedAt)
		.sort((a, b) => {
			const aTime = new Date(a.lastExecutedAt || 0).getTime();
			const bTime = new Date(b.lastExecutedAt || 0).getTime();
			return bTime - aTime;
		})
		.slice(0, limit);
};

/**
 * Get usage statistics
 */
export const getUsageStats = (commands: readonly Command[]): AnalyticsStats => {
	const totalExecutions = commands.reduce((sum, cmd) => sum + (cmd.executionCount || 0), 0);

	const averageExecutionsPerCommand = commands.length > 0 ? totalExecutions / commands.length : 0;

	const mostUsedCommands = getMostUsedCommands(commands, 5);

	const usageByCategory: Record<string, number> = {};
	for (const cmd of commands) {
		if (cmd.category) {
			usageByCategory[cmd.category] = (usageByCategory[cmd.category] || 0) + (cmd.executionCount || 0);
		}
	}

	return {
		totalExecutions,
		totalSearches: 0, // Would be tracked separately
		mostUsedCommands,
		averageExecutionsPerCommand,
		usageByCategory,
	};
};

/**
 * Get command usage trend (last N executions)
 */
export const getUsageTrend = (commands: readonly Command[]): readonly Command[] => {
	return getRecentlyUsedCommands(commands, 20);
};

/**
 * Calculate command popularity score
 */
export const calculatePopularityScore = (command: Command): number => {
	const executionScore = (command.executionCount || 0) * 10;
	const favoriteScore = command.isFavorite ? 50 : 0;
	const ratingScore = (command.rating || 0) * 10;
	const recentBonus = command.lastExecutedAt
		? Math.max(0, 30 - (Date.now() - new Date(command.lastExecutedAt).getTime()) / (1000 * 60 * 60 * 24))
		: 0;

	return executionScore + favoriteScore + ratingScore + recentBonus;
};

/**
 * Sort commands by popularity
 */
export const sortCommandsByPopularity = (commands: readonly Command[]): readonly Command[] => {
	return [...commands].sort((a, b) => {
		const aScore = calculatePopularityScore(a);
		const bScore = calculatePopularityScore(b);
		return bScore - aScore;
	});
};

/**
 * Get unused commands
 */
export const getUnusedCommands = (commands: readonly Command[]): readonly Command[] => {
	return commands.filter((cmd) => !cmd.executionCount || cmd.executionCount === 0);
};

/**
 * Get frequently used commands (executed more than N times)
 */
export const getFrequentlyUsedCommands = (commands: readonly Command[], threshold: number = 5): readonly Command[] => {
	return commands.filter((cmd) => (cmd.executionCount || 0) >= threshold);
};
