/**
 * Category Operations - Domain operations for command categorization
 */

import type { Result } from "../../../shared/types";
import type { Command } from "../../../types/command";
import type {
	CategorizedCommand,
	CategoryFilter,
	CategoryGroup,
	CategoryState,
	CommandCategory,
} from "../../../types/integration/categories";

// Create category
export const createCategory = (
	id: string,
	name: string,
	options?: Partial<CommandCategory>,
): Result<CommandCategory> => {
	if (!id || id.trim().length === 0) {
		return { success: false, error: new Error("Category ID is required") };
	}

	if (!name || name.trim().length === 0) {
		return { success: false, error: new Error("Category name is required") };
	}

	const category: CommandCategory = {
		id: id.trim(),
		name: name.trim(),
		description: options?.description,
		icon: options?.icon,
		color: options?.color,
		order: options?.order ?? 0,
		hidden: options?.hidden ?? false,
	};

	return { success: true, data: category };
};

// Categorize command
export const categorizeCommand = (command: Command, category: CommandCategory): CategorizedCommand => ({
	command,
	categoryData: category,
});

// Group commands by category
export const groupCommandsByCategory = (
	commands: readonly Command[],
	categories: readonly CommandCategory[],
): readonly CategoryGroup[] => {
	const groups: CategoryGroup[] = [];

	for (const category of categories) {
		if (category.hidden) continue;

		const categoryCommands = commands.filter((cmd) => cmd.category === category.id);

		if (categoryCommands.length > 0) {
			groups.push({
				category,
				commands: categoryCommands,
				count: categoryCommands.length,
			});
		}
	}

	// Sort by category order
	return groups.sort((a, b) => a.category.order - b.category.order);
};

// Filter commands by category
export const filterCommandsByCategory = (commands: readonly Command[], filter: CategoryFilter): readonly Command[] => {
	if (filter.showAll) {
		return commands;
	}

	return commands.filter((cmd) => filter.categoryIds.includes(cmd.category || ""));
};

// Get commands for category
export const getCommandsForCategory = (commands: readonly Command[], categoryId: string): readonly Command[] => {
	return commands.filter((cmd) => cmd.category === categoryId);
};

// Create category state
export const createCategoryState = (categories: readonly CommandCategory[]): CategoryState => ({
	categories,
	activeCategoryIds: categories.map((c) => c.id),
	showAll: true,
});

// Toggle category
export const toggleCategory = (state: CategoryState, categoryId: string): CategoryState => {
	const isActive = state.activeCategoryIds.includes(categoryId);

	if (isActive) {
		// Remove from active
		const newActiveIds = state.activeCategoryIds.filter((id) => id !== categoryId);
		return {
			...state,
			activeCategoryIds: newActiveIds,
			showAll: newActiveIds.length === state.categories.length,
		};
	} else {
		// Add to active
		return {
			...state,
			activeCategoryIds: [...state.activeCategoryIds, categoryId],
			showAll: false,
		};
	}
};

// Set all categories
export const setAllCategories = (state: CategoryState): CategoryState => ({
	...state,
	activeCategoryIds: state.categories.map((c) => c.id),
	showAll: true,
});

// Clear all categories
export const clearAllCategories = (state: CategoryState): CategoryState => ({
	...state,
	activeCategoryIds: [],
	showAll: false,
});
