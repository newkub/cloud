/**
 * CategoryManager - SolidJS component for managing command categories
 */

import { createMemo, createSignal, For, Show, splitProps } from "solid-js";
import type { CategoryGroup, CommandCategory } from "../../../types";
import { CategoryCard } from "./category-manager/CategoryCard";
import { CategoryForm } from "./category-manager/CategoryForm";
import { createCategoryHandlers } from "./category-manager/handlers";
import type { CategoryFormErrors, CategoryManagerProps } from "./category-manager/types";
import { getCategoryCommandCount } from "./category-manager/utils";

interface CategoryManagerHeaderProps {
	onCreate: () => void;
}

function CategoryManagerHeader(props: CategoryManagerHeaderProps) {
	return (
		<div class="manager-header">
			<h2 class="manager-title">Categories</h2>
			<button class="action-button create" onClick={props.onCreate} type="button">
				Create Category
			</button>
		</div>
	);
}

interface CategoryManagerFormPanelProps {
	isCreating: boolean;
	editingCategory: CommandCategory | null;
	errors: CategoryFormErrors;
	name: string;
	description: string;
	icon: string;
	color: string;
	onNameChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onIconChange: (value: string) => void;
	onColorChange: (value: string) => void;
	onCancel: () => void;
	onCreate: () => void;
	onUpdate: () => void;
}

function CategoryManagerFormPanel(props: CategoryManagerFormPanelProps) {
	return (
		<Show when={props.isCreating || props.editingCategory}>
			<CategoryForm
				isEditing={!!props.editingCategory}
				errors={props.errors}
				name={props.name}
				description={props.description}
				icon={props.icon}
				color={props.color}
				onNameChange={props.onNameChange}
				onDescriptionChange={props.onDescriptionChange}
				onIconChange={props.onIconChange}
				onColorChange={props.onColorChange}
				onCancel={props.onCancel}
				onSave={props.editingCategory ? props.onUpdate : props.onCreate}
			/>
		</Show>
	);
}

interface CategoryListProps {
	sortedCategories: readonly CommandCategory[];
	categoryGroups?: readonly CategoryGroup[];
	onEdit: (category: CommandCategory) => void;
	onDelete: (categoryId: string) => void;
	isEmpty: boolean;
}

function CategoryList(props: CategoryListProps) {
	return (
		<div class="categories-list">
			<For each={props.sortedCategories}>
				{(category) => (
					<CategoryCard
						category={category}
						commandCount={getCategoryCommandCount(category.id, props.categoryGroups)}
						onEdit={props.onEdit}
						onDelete={props.onDelete}
					/>
				)}
			</For>

			<Show when={props.isEmpty}>
				<div class="empty-state">
					<p class="empty-message">No categories</p>
				</div>
			</Show>
		</div>
	);
}

function createCategoryManagerState(props: CategoryManagerProps) {
	const [isCreating, setIsCreating] = createSignal(false);
	const [editingCategory, setEditingCategory] = createSignal<CommandCategory | null>(null);
	const [newCategoryName, setNewCategoryName] = createSignal("");
	const [newCategoryDescription, setNewCategoryDescription] = createSignal("");
	const [newCategoryIcon, setNewCategoryIcon] = createSignal("");
	const [newCategoryColor, setNewCategoryColor] = createSignal("#3b82f6");
	const [formError, setFormError] = createSignal<CategoryFormErrors>({});

	const sortedCategories = createMemo(() => {
		return [...(props.categories ?? [])].sort((a, b) => a.order - b.order);
	});

	const { handleCreateCategory, handleUpdateCategory, handleDeleteCategory, handleEditCategory, handleCancelEdit } =
		createCategoryHandlers(
			() => props.categories,
			editingCategory,
			newCategoryName,
			newCategoryDescription,
			newCategoryIcon,
			newCategoryColor,
			setEditingCategory,
			setNewCategoryName,
			setNewCategoryDescription,
			setNewCategoryIcon,
			setNewCategoryColor,
			setIsCreating,
			setFormError,
			props.onCreateCategory,
			props.onUpdateCategory,
			props.onDeleteCategory,
		);

	return {
		isCreating,
		setIsCreating,
		editingCategory,
		sortedCategories,
		newCategoryName,
		setNewCategoryName,
		newCategoryDescription,
		setNewCategoryDescription,
		newCategoryIcon,
		setNewCategoryIcon,
		newCategoryColor,
		setNewCategoryColor,
		formError,
		setFormError,
		handleCreateCategory,
		handleUpdateCategory,
		handleDeleteCategory,
		handleEditCategory,
		handleCancelEdit,
	};
}

export function CategoryManager(props: CategoryManagerProps) {
	const [local] = splitProps(props, [
		"categories",
		"categoryGroups",
		"onCreateCategory",
		"onUpdateCategory",
		"onDeleteCategory",
		"onReorderCategories",
		"commands",
	]);
	const state = createCategoryManagerState(local);

	return (
		<div class="category-manager">
			<CategoryManagerHeader
				onCreate={() => {
					state.setFormError({});
					state.setIsCreating(true);
				}}
			/>

			<CategoryManagerFormPanel
				isCreating={state.isCreating()}
				editingCategory={state.editingCategory()}
				errors={state.formError()}
				name={state.newCategoryName()}
				description={state.newCategoryDescription()}
				icon={state.newCategoryIcon()}
				color={state.newCategoryColor()}
				onNameChange={state.setNewCategoryName}
				onDescriptionChange={state.setNewCategoryDescription}
				onIconChange={state.setNewCategoryIcon}
				onColorChange={state.setNewCategoryColor}
				onCancel={state.handleCancelEdit}
				onCreate={state.handleCreateCategory}
				onUpdate={state.handleUpdateCategory}
			/>

			<CategoryList
				sortedCategories={state.sortedCategories()}
				categoryGroups={local.categoryGroups}
				onEdit={state.handleEditCategory}
				onDelete={state.handleDeleteCategory}
				isEmpty={!local.categories || local.categories.length === 0}
			/>
		</div>
	);
}

export type { CategoryManagerProps };
