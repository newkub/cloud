// Form Base Schemas - Core field type and base field schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Field Type Schema
 */
export const fieldTypeSchema = type(
	"'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime' | 'time' | 'month' | 'week' | 'color' | 'range' | 'file' | 'checkbox' | 'radio' | 'select' | 'textarea' | 'hidden'",
);

export type FieldType = typeof fieldTypeSchema.infer;

/**
 * Base Field Schema
 */
export const baseFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
});
