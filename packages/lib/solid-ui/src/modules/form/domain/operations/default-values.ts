// Form Default Values - Get default values for field types

import type {
	CheckboxField,
	DateField,
	FieldDef,
	FieldValue,
	NumberField,
	RadioField,
	SelectField,
	TextareaField,
	TextField,
} from "../models";

export const getDefaultValue = (field: FieldDef): FieldValue => {
	switch (field.type) {
		case "text":
		case "email":
		case "password":
		case "tel":
		case "url":
		case "search":
		case "hidden":
			return (field as TextField).defaultValue ?? "";
		case "number":
		case "range":
			return (field as NumberField).defaultValue ?? "";
		case "date":
		case "datetime":
		case "time":
		case "month":
		case "week":
			return (field as DateField).defaultValue ?? "";
		case "checkbox":
			return (field as CheckboxField).defaultValue ?? false;
		case "radio":
		case "select":
			return (field as RadioField | SelectField).defaultValue ?? "";
		case "textarea":
			return (field as TextareaField).defaultValue ?? "";
		case "file":
			return undefined;
		default:
			return undefined;
	}
};
