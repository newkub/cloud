import type { FieldDef, FieldState } from "../domain/models";
import { buildValidationRules, validateField } from "../domain/operations";

export function createValidateFieldByName(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
	config: { fields: FieldDef[] },
	fieldsAccessor: () => Record<string, FieldState>,
) {
	return (name: string): boolean => {
		const field = config.fields.find((f) => f.name === name);
		if (!field) return true;

		const state = fieldsAccessor()[name];
		if (!state) return true;

		const rules = buildValidationRules(field);
		const result = validateField(state.value, field, rules);

		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				error: result.valid ? null : result.errors[0],
				validating: false,
			},
		}));

		return result.valid;
	};
}

export function createValidate(validateFieldByName: (name: string) => boolean, config: { fields: FieldDef[] }) {
	return (name?: string): boolean => {
		if (name) {
			return validateFieldByName(name);
		}

		let allValid = true;
		for (const field of config.fields) {
			const valid = validateFieldByName(field.name);
			if (!valid) allValid = false;
		}
		return allValid;
	};
}
