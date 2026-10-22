// Form Validation - Validation types

import type { FieldDef as FieldDefType } from "./field-definitions";
import type { FieldValue } from "./field-state";

export interface ValidationRule {
	validate: (value: FieldValue, field?: FieldDefType) => boolean;
	message: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

// Built-in validation types
export type ValidatorFn = (value: FieldValue, ...args: unknown[]) => boolean;

export interface ValidatorDef {
	name: string;
	fn: ValidatorFn;
	message: string;
}
