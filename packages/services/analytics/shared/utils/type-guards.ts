/**
 * Type guard utilities
 * Infrastructure-level type checking utilities
 */

export const isObject = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isString = (value: unknown): value is string => {
	return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
	return typeof value === "number" && !Number.isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
	return typeof value === "boolean";
};

export const isArray = (value: unknown): value is unknown[] => {
	return Array.isArray(value);
};
