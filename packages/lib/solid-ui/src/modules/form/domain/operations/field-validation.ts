// Form Field Validation - Validate individual fields

import type { FieldDef, FieldValue, ValidationResult, ValidationRule } from "../models";

export const isRequired = (_field: FieldDef): boolean => {
	return false;
};

export const validateField = (value: FieldValue, field: FieldDef, rules: ValidationRule[]): ValidationResult => {
	const errors: string[] = [];

	for (const rule of rules) {
		const valid = rule.validate(value, field);
		if (!valid) {
			errors.push(rule.message);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
};
