import type { CategoryGroup, CommandCategory } from "../../../../types";

export interface CategoryManagerProps {
	categories?: readonly CommandCategory[];
	categoryGroups?: readonly CategoryGroup[];
	onCreateCategory?: (category: Omit<CommandCategory, "id">) => void;
	onUpdateCategory?: (categoryId: string, updates: Partial<CommandCategory>) => void;
	onDeleteCategory?: (categoryId: string) => void;
	onReorderCategories?: (categoryIds: readonly string[]) => void;
	commands?: readonly { id: string; label: string; category?: string }[];
}

export interface CategoryCardProps {
	category: CommandCategory;
	commandCount: number;
	onEdit: (category: CommandCategory) => void;
	onDelete: (categoryId: string) => void;
}

export interface CategoryFormErrors {
	name?: string;
}

export interface CategoryFormProps {
	isEditing: boolean;
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
	onSave: () => void;
}
