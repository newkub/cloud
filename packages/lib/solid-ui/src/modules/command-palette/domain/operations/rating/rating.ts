/**
 * Rating Operations - Domain operations for command rating/feedback
 * Pure functions for managing command ratings
 */

import type { Command } from "../../../types";

/**
 * Rate a command (1-5 stars)
 */
export const rateCommand = (command: Command, rating: number): Command => {
	if (rating < 1 || rating > 5) {
		throw new Error("Rating must be between 1 and 5");
	}
	return {
		...command,
		rating,
	};
};

/**
 * Get average rating from multiple commands
 */
export const getAverageRating = (commands: readonly Command[]): number => {
	const ratedCommands = commands.filter((cmd) => cmd.rating !== undefined);
	if (ratedCommands.length === 0) return 0;

	const total = ratedCommands.reduce((sum, cmd) => sum + (cmd.rating || 0), 0);
	return total / ratedCommands.length;
};

/**
 * Get top rated commands
 */
export const getTopRatedCommands = (commands: readonly Command[], limit: number = 10): readonly Command[] => {
	const ratedCommands = commands.filter((cmd) => cmd.rating !== undefined);
	return ratedCommands.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
};

/**
 * Sort commands by rating
 */
export const sortCommandsByRating = (commands: readonly Command[]): readonly Command[] => {
	return [...commands].sort((a, b) => {
		const aRating = a.rating || 0;
		const bRating = b.rating || 0;
		if (aRating !== bRating) return bRating - aRating;
		// Secondary sort by execution count
		return (b.executionCount || 0) - (a.executionCount || 0);
	});
};

/**
 * Get rating statistics
 */
export const getRatingStats = (
	commands: readonly Command[],
): {
	readonly average: number;
	readonly count: number;
	readonly distribution: readonly number[];
} => {
	const ratedCommands = commands.filter((cmd) => cmd.rating !== undefined);
	const count = ratedCommands.length;

	if (count === 0) {
		return {
			average: 0,
			count: 0,
			distribution: [0, 0, 0, 0, 0],
		};
	}

	const distribution = [0, 0, 0, 0, 0];
	for (const cmd of ratedCommands) {
		const rating = cmd.rating || 0;
		if (rating >= 1 && rating <= 5) {
			distribution[rating - 1]++;
		}
	}

	const average = getAverageRating(commands);

	return {
		average,
		count,
		distribution,
	};
};
