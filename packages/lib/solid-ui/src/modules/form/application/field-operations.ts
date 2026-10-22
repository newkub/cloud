import type { FieldDef, FieldState, FieldValue } from "../domain/models";
import { maybeTrim } from "../domain/operations";

export function createSetValue(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
	config: { fields: FieldDef[] },
	validateOn: string,
	validateFieldByName: (name: string) => void,
) {
	return (name: string, value: FieldValue) => {
		const field = config.fields.find((f) => f.name === name);
		if (!field) return;

		const processedValue = maybeTrim(value, (field as { trim?: boolean }).trim);

		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				value: processedValue,
				dirty: true,
			},
		}));

		if (validateOn === "change" || validateOn === "all") {
			validateFieldByName(name);
		}
	};
}

export function createSetValueWithoutValidation(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
	config: { fields: FieldDef[] },
) {
	return (name: string, value: FieldValue) => {
		const field = config.fields.find((f) => f.name === name);
		if (!field) return;

		const processedValue = maybeTrim(value, (field as { trim?: boolean }).trim);

		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				value: processedValue,
				dirty: true,
			},
		}));
	};
}

export function createSetError(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
) {
	return (name: string, error: string | string[]) => {
		const errorMessage = Array.isArray(error) ? error[0] : error;
		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				error: errorMessage,
			},
		}));
	};
}

export function createClearError(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
) {
	return (name: string) => {
		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				error: null,
			},
		}));
	};
}

export function createReset(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
	config: { fields: FieldDef[] },
	setIsSubmitted: (value: boolean) => void,
) {
	return (name?: string) => {
		if (name) {
			const field = config.fields.find((f) => f.name === name);
			if (field) {
				const defaultValue = field.defaultValue;
				fields((prev) => ({
					...prev,
					[name]: {
						value: defaultValue,
						error: null,
						touched: false,
						dirty: false,
						focused: false,
						validating: false,
					},
				}));
			}
		} else {
			fields(() => {
				const newFields: Record<string, FieldState> = {};
				for (const field of config.fields) {
					const defaultValue = field.defaultValue;
					newFields[field.name] = {
						value: defaultValue,
						error: null,
						touched: false,
						dirty: false,
						focused: false,
						validating: false,
					};
				}
				return newFields;
			});
			setIsSubmitted(false);
		}
	};
}

export function createFocus(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
) {
	return (name: string) => {
		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				focused: true,
			},
		}));
	};
}

export function createBlur(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
	validateOn: string,
	validateFieldByName: (name: string) => void,
) {
	return (name: string) => {
		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
				focused: false,
				touched: true,
			},
		}));

		if (validateOn === "blur" || validateOn === "all") {
			validateFieldByName(name);
		}
	};
}

export function createDisable(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
) {
	return (name: string) => {
		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
			},
		}));
	};
}

export function createEnable(
	fields: (setter: (prev: Record<string, FieldState>) => Record<string, FieldState>) => void,
) {
	return (name: string) => {
		fields((prev) => ({
			...prev,
			[name]: {
				...prev[name],
			},
		}));
	};
}
