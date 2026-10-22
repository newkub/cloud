// Form Field State Schemas - Field value and state schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Field Value Schema
 */
export const fieldValueSchema = type("string | number | boolean | object | null | undefined");

/**
 * Field State Schema
 */
export const fieldStateSchema = type({
	value: "string | number | boolean | object | null | undefined",
	error: "string >= 1 | null",
	touched: "boolean",
	dirty: "boolean",
	focused: "boolean",
	validating: "boolean",
});

/**
 * Field Meta Schema
 */
export const fieldMetaSchema = type({
	name: "string.alphanumeric >= 1",
	type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime' | 'time' | 'month' | 'week' | 'color' | 'range' | 'file' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'hidden'",
	required: "boolean",
	disabled: "boolean",
	readonly: "boolean",
});
