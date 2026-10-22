import { Show } from "solid-js";
import type { CategoryFormProps } from "./types";

interface CategoryNameInputProps {
	name: string;
	error?: string;
	onNameChange: (value: string) => void;
}

function CategoryNameInput(props: CategoryNameInputProps) {
	return (
		<div class="form-group">
			<label for="category-name" class="form-label">
				Name
			</label>
			<input
				id="category-name"
				type="text"
				value={props.name}
				onInput={(e) => props.onNameChange(e.currentTarget.value)}
				class={props.error ? "form-input is-invalid" : "form-input"}
				placeholder="Category name"
				aria-invalid={!!props.error}
			/>
			<Show when={props.error}>
				{(error) => (
					<p class="form-error" role="alert">
						{error()}
					</p>
				)}
			</Show>
		</div>
	);
}

interface CategoryDescriptionInputProps {
	description: string;
	onDescriptionChange: (value: string) => void;
}

function CategoryDescriptionInput(props: CategoryDescriptionInputProps) {
	return (
		<div class="form-group">
			<label for="category-description" class="form-label">
				Description
			</label>
			<textarea
				id="category-description"
				value={props.description}
				onInput={(e) => props.onDescriptionChange(e.currentTarget.value)}
				class="form-textarea"
				placeholder="Category description"
				rows={2}
			/>
		</div>
	);
}

interface CategoryIconInputProps {
	icon: string;
	onIconChange: (value: string) => void;
}

function CategoryIconInput(props: CategoryIconInputProps) {
	return (
		<div class="form-group">
			<label for="category-icon" class="form-label">
				Icon
			</label>
			<input
				id="category-icon"
				type="text"
				value={props.icon}
				onInput={(e) => props.onIconChange(e.currentTarget.value)}
				class="form-input"
				placeholder="📁"
			/>
		</div>
	);
}

interface CategoryColorInputProps {
	color: string;
	onColorChange: (value: string) => void;
}

function CategoryColorInput(props: CategoryColorInputProps) {
	return (
		<div class="form-group">
			<label for="category-color" class="form-label">
				Color
			</label>
			<input
				id="category-color"
				type="color"
				value={props.color}
				onChange={(e) => props.onColorChange(e.currentTarget.value)}
				class="form-color"
			/>
		</div>
	);
}

interface CategoryFormActionsProps {
	isEditing: boolean;
	onCancel: () => void;
	onSave: () => void;
}

function CategoryFormActions(props: CategoryFormActionsProps) {
	return (
		<div class="form-actions">
			<button class="action-button cancel" onClick={props.onCancel} type="button">
				Cancel
			</button>
			<button class="action-button save" onClick={props.onSave} type="button">
				{props.isEditing ? "Update" : "Create"}
			</button>
		</div>
	);
}

export function CategoryForm(props: CategoryFormProps) {
	return (
		<div class="category-form">
			<h3 class="form-title">{props.isEditing ? "Edit Category" : "Create Category"}</h3>
			<CategoryNameInput name={props.name} error={props.errors.name} onNameChange={props.onNameChange} />
			<CategoryDescriptionInput description={props.description} onDescriptionChange={props.onDescriptionChange} />
			<CategoryIconInput icon={props.icon} onIconChange={props.onIconChange} />
			<CategoryColorInput color={props.color} onColorChange={props.onColorChange} />
			<CategoryFormActions isEditing={props.isEditing} onCancel={props.onCancel} onSave={props.onSave} />
		</div>
	);
}
