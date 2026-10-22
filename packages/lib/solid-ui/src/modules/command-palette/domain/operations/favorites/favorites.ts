/**
 * Favorites Operations - Domain operations for command favorites
 * Pure functions for managing favorite commands
 */

import type { Command } from "../../../types";

/**
 * Toggle favorite status of a command
 */
export const toggleFavorite = (command: Command): Command => ({
	...command,
	isFavorite: !command.isFavorite,
});

/**
 * Get favorite commands from all commands
 */
export const getFavoriteCommands = (commands: readonly Command[]): readonly Command[] =>
	commands.filter((command) => command.isFavorite);

/**
 * Get commands sorted by favorites first, then by execution count
 */
export const getCommandsSortedByFavorites = (commands: readonly Command[]): readonly Command[] => {
	const favorites = getFavoriteCommands(commands);
	const nonFavorites = commands.filter((command) => !command.isFavorite);

	// Sort favorites by execution count
	const sortedFavorites = [...favorites].sort((a, b) => (b.executionCount || 0) - (a.executionCount || 0));

	// Sort non-favorites by execution count
	const sortedNonFavorites = [...nonFavorites].sort((a, b) => (b.executionCount || 0) - (a.executionCount || 0));

	return [...sortedFavorites, ...sortedNonFavorites];
};

/**
 * Check if a command is a favorite
 */
export const isFavorite = (command: Command): boolean => Boolean(command.isFavorite);
