/**
 * Category Management Use Cases - Application orchestration
 * Handles category management with validation and persistence
 */

import { createCategory, groupCommandsByCategory } from "../../../domain/operations/category";
import type { CategoryRepository, EventDispatcher } from "../../../ports";
import { UseCaseError, ValidationError } from "../../../shared/errors";
import type { Result } from "../../../shared/types";
import type { CategoryGroup, Command, CommandCategory } from "../../../types";

export interface CreateCategoryRequest {
	readonly id: string;
	readonly name: string;
	readonly description?: string;
	readonly icon?: string;
	readonly color?: string;
	readonly order?: number;
	readonly hidden?: boolean;
}

export const createCategoryUseCase =
	(categoryRepository: CategoryRepository, _eventDispatcher: EventDispatcher) =>
	async (request: CreateCategoryRequest): Promise<Result<CommandCategory>> => {
		try {
			// Step 1: Create category domain object
			const createResult = createCategory(request.id, request.name, {
				description: request.description,
				icon: request.icon,
				color: request.color,
				order: request.order,
				hidden: request.hidden,
			});
			if (!createResult.success) {
				return {
					success: false,
					error: ValidationError("category", createResult.error.message),
				};
			}

			const category = createResult.data;

			// Step 2: Check if category already exists
			const existingResult = await categoryRepository.findById(category.id);
			if (!existingResult.success) {
				return {
					success: false,
					error: UseCaseError("createCategory", "Failed to check existing category", existingResult.error),
				};
			}

			if (existingResult.data) {
				return {
					success: false,
					error: new Error(`Category already exists: ${category.id}`),
				};
			}

			// Step 3: Save category
			const saveResult = await categoryRepository.save(category);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("createCategory", "Failed to save category", saveResult.error),
				};
			}

			// Step 4: Dispatch event
			// Note: Would need category created event type
			// const event = createCategoryCreatedEvent(saveResult.data);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: saveResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"createCategory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const updateCategoryUseCase =
	(categoryRepository: CategoryRepository, _eventDispatcher: EventDispatcher) =>
	async (categoryId: string, updates: Partial<CommandCategory>): Promise<Result<CommandCategory>> => {
		try {
			// Step 1: Get existing category
			const existingResult = await categoryRepository.findById(categoryId);
			if (!existingResult.success) {
				return {
					success: false,
					error: UseCaseError("updateCategory", "Failed to get existing category", existingResult.error),
				};
			}

			if (!existingResult.data) {
				return {
					success: false,
					error: new Error(`Category not found: ${categoryId}`),
				};
			}

			// Step 2: Update category
			const updatedCategory: CommandCategory = {
				...existingResult.data,
				...updates,
			};

			// Step 3: Save updated category
			const saveResult = await categoryRepository.save(updatedCategory);
			if (!saveResult.success) {
				return {
					success: false,
					error: UseCaseError("updateCategory", "Failed to save category", saveResult.error),
				};
			}

			// Step 4: Dispatch event
			// Note: Would need category updated event type
			// const event = createCategoryUpdatedEvent(saveResult.data);
			// await eventDispatcher.dispatch(event);

			return { success: true, data: saveResult.data };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"updateCategory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const deleteCategoryUseCase =
	(categoryRepository: CategoryRepository, _eventDispatcher: EventDispatcher) =>
	async (categoryId: string): Promise<Result<{ success: boolean }>> => {
		try {
			// Step 1: Delete category
			const deleteResult = await categoryRepository.delete(categoryId);
			if (!deleteResult.success) {
				return {
					success: false,
					error: UseCaseError("deleteCategory", "Failed to delete category", deleteResult.error),
				};
			}

			// Step 2: Dispatch event
			// Note: Would need category deleted event type
			// const event = createCategoryDeletedEvent(categoryId);
			// await eventDispatcher.dispatch(event);

			return {
				success: true,
				data: { success: true },
			};
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"deleteCategory",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};

export const getCategoryGroupsUseCase =
	(categoryRepository: CategoryRepository) =>
	async (commands: readonly unknown[]): Promise<Result<readonly CategoryGroup[]>> => {
		try {
			// Step 1: Get all categories
			const categoriesResult = await categoryRepository.findAll();
			if (!categoriesResult.success) {
				return {
					success: false,
					error: UseCaseError("getCategoryGroups", "Failed to get categories", categoriesResult.error),
				};
			}

			// Step 2: Group commands by category
			const groups = groupCommandsByCategory(commands as readonly Command[], categoriesResult.data);

			return { success: true, data: groups };
		} catch (error) {
			return {
				success: false,
				error: UseCaseError(
					"getCategoryGroups",
					"Unexpected error",
					error instanceof Error ? error : new Error(String(error)),
				),
			};
		}
	};
