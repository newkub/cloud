import type { Accessor } from "solid-js";
import type { CommandCategory } from "../../../../types";
import type { CategoryFormErrors } from "./types";

interface CategoryFormSetters {
	setNewCategoryName: (name: string) => void;
	setNewCategoryDescription: (description: string) => void;
	setNewCategoryIcon: (icon: string) => void;
	setNewCategoryColor: (color: string) => void;
	setIsCreating: (creating: boolean) => void;
	setEditingCategory: (category: CommandCategory | null) => void;
	setFormError: (errors: CategoryFormErrors) => void;
}

interface CategoryFormValues {
	editingCategory: Accessor<CommandCategory | null>;
	name: Accessor<string>;
	description: Accessor<string>;
	icon: Accessor<string>;
	color: Accessor<string>;
}

function createCategoryData(
	name: string,
	description: string,
	icon: string,
	color: string,
	order: number,
): Omit<CommandCategory, "id"> {
	const categoryData: Omit<CommandCategory, "id"> = {
		name,
		color,
		order,
	};

	if (description) {
		(categoryData as CommandCategory & { description: string }).description = description;
	}
	if (icon) {
		(categoryData as CommandCategory & { icon: string }).icon = icon;
	}

	return categoryData;
}

function createCategoryUpdates(
	name: string,
	description: string,
	icon: string,
	color: string,
): Partial<CommandCategory> {
	const updates: Partial<CommandCategory> = {
		name,
		color,
	};

	if (description) {
		(updates as CommandCategory & { description: string }).description = description;
	}
	if (icon) {
		(updates as CommandCategory & { icon: string }).icon = icon;
	}

	return updates;
}

function resetCategoryForm(setters: CategoryFormSetters) {
	setters.setNewCategoryName("");
	setters.setNewCategoryDescription("");
	setters.setNewCategoryIcon("");
	setters.setNewCategoryColor("#3b82f6");
	setters.setFormError({});
}

function validateCategoryName(name: string, setFormError: (errors: CategoryFormErrors) => void): string | null {
	const trimmed = name.trim();
	if (!trimmed) {
		setFormError({ name: "Category name is required" });
		return null;
	}
	setFormError({});
	return trimmed;
}

function createCreateHandler(
	categories: Accessor<readonly CommandCategory[] | undefined>,
	values: CategoryFormValues,
	onCreateCategory: ((category: Omit<CommandCategory, "id">) => void) | undefined,
	setters: CategoryFormSetters,
) {
	return () => {
		const name = validateCategoryName(values.name(), setters.setFormError);
		if (name === null) {
			return;
		}
		const categoryData = createCategoryData(
			name,
			values.description(),
			values.icon(),
			values.color(),
			categories()?.length ?? 0,
		);
		onCreateCategory?.(categoryData);
		resetCategoryForm(setters);
		setters.setIsCreating(false);
	};
}

function createUpdateHandler(
	values: CategoryFormValues,
	onUpdateCategory: ((categoryId: string, updates: Partial<CommandCategory>) => void) | undefined,
	setters: CategoryFormSetters,
) {
	return () => {
		const editingCategory = values.editingCategory();
		if (!editingCategory) {
			return;
		}
		const name = validateCategoryName(values.name(), setters.setFormError);
		if (name === null) {
			return;
		}
		const updates = createCategoryUpdates(name, values.description(), values.icon(), values.color());
		onUpdateCategory?.(editingCategory.id, updates);
		setters.setEditingCategory(null);
		resetCategoryForm(setters);
	};
}

function createDeleteHandler(onDeleteCategory: ((categoryId: string) => void) | undefined) {
	return (categoryId: string) => {
		onDeleteCategory?.(categoryId);
	};
}

function createEditHandler(setters: CategoryFormSetters) {
	return (category: CommandCategory) => {
		setters.setEditingCategory(category);
		setters.setNewCategoryName(category.name);
		setters.setNewCategoryDescription(category.description ?? "");
		setters.setNewCategoryIcon(category.icon ?? "");
		setters.setNewCategoryColor(category.color ?? "#3b82f6");
		setters.setFormError({});
	};
}

function createCancelHandler(setters: CategoryFormSetters) {
	return () => {
		setters.setEditingCategory(null);
		setters.setIsCreating(false);
		resetCategoryForm(setters);
	};
}

export function createCategoryHandlers(
	categories: Accessor<readonly CommandCategory[] | undefined>,
	editingCategory: Accessor<CommandCategory | null>,
	newCategoryName: Accessor<string>,
	newCategoryDescription: Accessor<string>,
	newCategoryIcon: Accessor<string>,
	newCategoryColor: Accessor<string>,
	setEditingCategory: (category: CommandCategory | null) => void,
	setNewCategoryName: (name: string) => void,
	setNewCategoryDescription: (description: string) => void,
	setNewCategoryIcon: (icon: string) => void,
	setNewCategoryColor: (color: string) => void,
	setIsCreating: (creating: boolean) => void,
	setFormError: (errors: CategoryFormErrors) => void,
	onCreateCategory?: (category: Omit<CommandCategory, "id">) => void,
	onUpdateCategory?: (categoryId: string, updates: Partial<CommandCategory>) => void,
	onDeleteCategory?: (categoryId: string) => void,
) {
	const setters: CategoryFormSetters = {
		setNewCategoryName,
		setNewCategoryDescription,
		setNewCategoryIcon,
		setNewCategoryColor,
		setIsCreating,
		setEditingCategory,
		setFormError,
	};

	const values: CategoryFormValues = {
		editingCategory,
		name: newCategoryName,
		description: newCategoryDescription,
		icon: newCategoryIcon,
		color: newCategoryColor,
	};

	const handleCreateCategory = createCreateHandler(categories, values, onCreateCategory, setters);
	const handleUpdateCategory = createUpdateHandler(values, onUpdateCategory, setters);
	const handleDeleteCategory = createDeleteHandler(onDeleteCategory);
	const handleEditCategory = createEditHandler(setters);
	const handleCancelEdit = createCancelHandler(setters);

	return {
		handleCreateCategory,
		handleUpdateCategory,
		handleDeleteCategory,
		handleEditCategory,
		handleCancelEdit,
	};
}
