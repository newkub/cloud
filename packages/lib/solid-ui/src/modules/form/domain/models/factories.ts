// Form Field Factories - Domain layer field creation functions

import type { CheckboxField, FileField, NumberField, SelectField, TextareaField, TextField } from "./field-definitions";

export const createTextField = (name: string, label?: string, config?: Partial<TextField>): TextField => {
	const field: TextField = {
		name,
		type: "text",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createEmailField = (name: string, label?: string, config?: Partial<TextField>): TextField => {
	const field: TextField = {
		name,
		type: "email",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createPasswordField = (name: string, label?: string, config?: Partial<TextField>): TextField => {
	const field: TextField = {
		name,
		type: "password",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createNumberField = (name: string, label?: string, config?: Partial<NumberField>): NumberField => {
	const field: NumberField = {
		name,
		type: "number",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createSelectField = (
	name: string,
	options: Array<{ label: string; value: string }>,
	label?: string,
	config?: Partial<SelectField>,
): SelectField => {
	const field: SelectField = {
		name,
		type: "select",
		options,
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createCheckboxField = (name: string, label?: string, config?: Partial<CheckboxField>): CheckboxField => {
	const field: CheckboxField = {
		name,
		type: "checkbox",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createTextareaField = (name: string, label?: string, config?: Partial<TextareaField>): TextareaField => {
	const field: TextareaField = {
		name,
		type: "textarea",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};

export const createFileField = (name: string, label?: string, config?: Partial<FileField>): FileField => {
	const field: FileField = {
		name,
		type: "file",
	};
	if (label) field.label = label;
	return { ...field, ...config };
};
