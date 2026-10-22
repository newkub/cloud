// Form Field Definitions - Field type definitions

export interface BaseField {
	name: string;
	label?: string;
	placeholder?: string;
	helpText?: string;
	disabled?: boolean;
	readonly?: boolean;
	autocomplete?: string;
}

export interface TextField extends BaseField {
	type: "text" | "email" | "password" | "tel" | "url" | "search";
	defaultValue?: string;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	trim?: boolean;
}

export interface NumberField extends BaseField {
	type: "number" | "range";
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
}

export interface DateField extends BaseField {
	type: "date" | "datetime" | "time" | "month" | "week";
	defaultValue?: string;
	min?: string;
	max?: string;
}

export interface CheckboxField extends BaseField {
	type: "checkbox";
	defaultValue?: boolean;
	checkedValue?: string;
	uncheckedValue?: string;
}

export interface RadioField extends BaseField {
	type: "radio";
	options: Array<{ label: string; value: string; disabled?: boolean }>;
	defaultValue?: string;
}

export interface SelectField extends BaseField {
	type: "select";
	options: Array<{ label: string; value: string; disabled?: boolean }>;
	defaultValue?: string;
	multiple?: boolean;
	size?: number;
}

export interface TextareaField extends BaseField {
	type: "textarea";
	defaultValue?: string;
	rows?: number;
	minLength?: number;
	maxLength?: number;
	trim?: boolean;
}

export interface FileField extends BaseField {
	type: "file";
	accept?: string;
	multiple?: boolean;
	capture?: "user" | "environment";
	maxSize?: number; // bytes
	defaultValue?: File | File[] | null;
}

export interface HiddenField extends BaseField {
	type: "hidden";
	defaultValue?: string;
}

export type FieldDef =
	| TextField
	| NumberField
	| DateField
	| CheckboxField
	| RadioField
	| SelectField
	| TextareaField
	| FileField
	| HiddenField;
