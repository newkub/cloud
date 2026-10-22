// Form Utilities - Pure utility functions

import type { FieldDef, FieldValue } from "../models";

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const deepEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true;
	if (a === null || b === null) return a === b;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return false;
	if (Array.isArray(a) !== Array.isArray(b)) return false;

	const aObj = a as Record<string, unknown>;
	const bObj = b as Record<string, unknown>;

	const keysA = Object.keys(aObj);
	const keysB = Object.keys(bObj);

	if (keysA.length !== keysB.length) return false;

	for (const key of keysA) {
		if (!keysB.includes(key)) return false;
		if (!deepEqual(aObj[key], bObj[key])) return false;
	}

	return true;
};

export const maybeTrim = (value: FieldValue, shouldTrim?: boolean): FieldValue => {
	if (shouldTrim && typeof value === "string") {
		return value.trim();
	}
	return value;
};

export const coerceValue = (value: FieldValue, type: FieldDef["type"]): FieldValue => {
	switch (type) {
		case "number":
		case "range": {
			if (value === "" || value === undefined) return undefined;
			const num = parseFloat(value as string);
			return Number.isNaN(num) ? undefined : num;
		}
		case "checkbox":
			if (typeof value === "boolean") return value;
			if (typeof value === "string") {
				if (value === "true") return true;
				if (value === "false") return false;
			}
			if ((value as unknown) === true) return true;
			if ((value as unknown) === false) return false;
			return undefined;
		case "file":
			return value;
		default:
			return value;
	}
};

export const getFirstError = (errors: Record<string, string[]>): string | null => {
	const entries = Object.entries(errors);
	for (const [, errorList] of entries) {
		if (errorList.length > 0) {
			return errorList[0];
		}
	}
	return null;
};

export const hasErrors = (errors: Record<string, string[]>): boolean => {
	return Object.values(errors).some((list) => list.length > 0);
};
