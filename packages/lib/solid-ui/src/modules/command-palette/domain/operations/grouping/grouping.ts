/**
 * Grouping Operations - Domain operations for command grouping/categorization
 * Pure functions for organizing commands by category
 */

import type { Command } from "../../../types";

export interface CommandGroup {
	readonly category: string;
	readonly commands: readonly Command[];
	readonly count: number;
}

/**
 * Group commands by category
 */
export const groupCommandsByCategory = (commands: readonly Command[]): readonly CommandGroup[] => {
	const categoryMap = new Map<string, Command[]>();

	for (const command of commands) {
		const category = command.category || "Uncategorized";
		if (!categoryMap.has(category)) {
			categoryMap.set(category, []);
		}
		categoryMap.get(category)?.push(command);
	}

	return Array.from(categoryMap.entries()).map(([category, cmds]) => ({
		category,
		commands: cmds,
		count: cmds.length,
	}));
};

/**
 * Get all unique categories
 */
export const getUniqueCategories = (commands: readonly Command[]): readonly string[] => {
	const categories = new Set<string>();
	for (const command of commands) {
		if (command.category) {
			categories.add(command.category);
		}
	}
	return Array.from(categories).sort();
};

/**
 * Filter commands by category
 */
export const filterCommandsByCategory = (commands: readonly Command[], category: string): readonly Command[] => {
	return commands.filter((cmd) => cmd.category === category);
};

/**
 * Sort groups by command count (descending)
 */
export const sortGroupsByCount = (groups: readonly CommandGroup[]): readonly CommandGroup[] => {
	return [...groups].sort((a, b) => b.count - a.count);
};

/**
 * Sort groups by category name (alphabetical)
 */
export const sortGroupsByName = (groups: readonly CommandGroup[]): readonly CommandGroup[] => {
	return [...groups].sort((a, b) => a.category.localeCompare(b.category));
};

/**
 * Get category for a command
 */
export const getCommandCategory = (command: Command): string => {
	return command.category || "Uncategorized";
};

/**
 * Check if command belongs to category
 */
export const isCommandInCategory = (command: Command, category: string): boolean => {
	return command.category === category;
};

/**
 * Get commands with category
 */
export const getCommandsWithCategory = (commands: readonly Command[]): readonly Command[] => {
	return commands.filter((cmd) => cmd.category !== undefined && cmd.category !== "");
};

/**
 * Get commands without category
 */
export const getCommandsWithoutCategory = (commands: readonly Command[]): readonly Command[] => {
	return commands.filter((cmd) => !cmd.category || cmd.category === "");
};
