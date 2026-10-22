/**
 * Command Categories Types - Domain types for command categorization
 */

import type { Command } from "../command";

// Category types
export interface CommandCategory {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly icon?: string;
	readonly color?: string;
	readonly order: number;
	readonly hidden?: boolean;
}

export interface CategorizedCommand {
	readonly command: Command;
	readonly categoryData: CommandCategory;
}

export interface CategoryFilter {
	readonly categoryIds: readonly string[];
	readonly showAll: boolean;
}

export interface CategoryGroup {
	readonly category: CommandCategory;
	readonly commands: readonly Command[];
	readonly count: number;
}

// Category state
export interface CategoryState {
	readonly categories: readonly CommandCategory[];
	readonly activeCategoryIds: readonly string[];
	readonly showAll: boolean;
}
