// Form Config Schemas - Form configuration schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import {
	checkboxFieldSchema,
	dateFieldSchema,
	fileFieldSchema,
	hiddenFieldSchema,
	numberFieldSchema,
	radioFieldSchema,
	selectFieldSchema,
	textareaFieldSchema,
	textFieldSchema,
} from "./field-types";

/**
 * Field Definition Schema (discriminated union of all field types)
 */
export const fieldDefSchema = textFieldSchema
	.or(numberFieldSchema)
	.or(dateFieldSchema)
	.or(checkboxFieldSchema)
	.or(radioFieldSchema)
	.or(selectFieldSchema)
	.or(textareaFieldSchema)
	.or(fileFieldSchema)
	.or(hiddenFieldSchema);

/**
 * Form Config Schema
 */
export const formConfigSchema = type({
	"id?": "string.alphanumeric >= 1",
	"name?": "string.alphanumeric >= 1",
	fields: fieldDefSchema.array().atLeastLength(1),
	"validateOn?": "'blur' | 'change' | 'submit' | 'all'",
	"resetOnSubmit?": "boolean",
	"clearOnSubmit?": "boolean",
	"preventInvalidSubmit?": "boolean",
});
