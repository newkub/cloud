// Form Field State - Field value and state types

import type { FieldType } from "./field-types";

export type FieldValue = string | number | boolean | File | File[] | string[] | undefined | null;

export interface FieldState {
	value: FieldValue;
	error: string | null;
	touched: boolean;
	dirty: boolean;
	focused: boolean;
	validating: boolean;
}

export interface FieldMeta {
	name: string;
	type: FieldType;
	required: boolean;
	disabled: boolean;
	readonly: boolean;
}
