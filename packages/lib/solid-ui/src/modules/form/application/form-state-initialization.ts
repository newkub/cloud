import type { FieldDef, FieldState, FieldValue } from "../domain/models";
import { getDefaultValue } from "../domain/operations";

export function initializeFieldStates(fields: FieldDef[]): Map<string, FieldState> {
	const fieldStates = new Map<string, FieldState>();
	for (const field of fields) {
		const defaultValue = getDefaultValue(field);
		fieldStates.set(field.name, {
			value: defaultValue,
			error: null,
			touched: false,
			dirty: false,
			focused: false,
			validating: false,
		});
	}
	return fieldStates;
}

export function initializeFieldState(field: FieldDef): FieldState {
	const defaultValue = getDefaultValue(field);
	return {
		value: defaultValue,
		error: null,
		touched: false,
		dirty: false,
		focused: false,
		validating: false,
	};
}

export function getInitialValues(fields: FieldDef[]): Record<string, FieldValue> {
	const initial: Record<string, FieldValue> = {};
	for (const field of fields) {
		initial[field.name] = getDefaultValue(field);
	}
	return initial;
}
