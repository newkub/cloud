// Form Field Type Schemas - Specific field type schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Option Schema for radio/select fields
 */
const optionSchema = type({
	label: "string >= 1",
	value: "string >= 1",
	"disabled?": "boolean",
});

/**
 * Text Field Schema
 */
export const textFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'text' | 'email' | 'password' | 'tel' | 'url' | 'search'",
	"defaultValue?": "string >= 1",
	"minLength?": "number.integer >= 0",
	"maxLength?": "number.integer >= 0",
	"pattern?": "string >= 1",
	"trim?": "boolean",
});

/**
 * Number Field Schema
 */
export const numberFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'number' | 'range'",
	"defaultValue?": "number",
	"min?": "number",
	"max?": "number",
	"step?": "number > 0",
});

/**
 * Date Field Schema
 */
export const dateFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'date' | 'datetime' | 'time' | 'month' | 'week'",
	"defaultValue?": "string >= 1",
	"min?": "string >= 1",
	"max?": "string >= 1",
});

/**
 * Checkbox Field Schema
 */
export const checkboxFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'checkbox'",
	"defaultValue?": "boolean",
	"checkedValue?": "string >= 1",
	"uncheckedValue?": "string >= 1",
});

/**
 * Radio Field Schema
 */
export const radioFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'radio'",
	options: optionSchema.array().atLeastLength(1),
	"defaultValue?": "string >= 1",
});

/**
 * Select Field Schema
 */
export const selectFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'select'",
	options: optionSchema.array().atLeastLength(1),
	"defaultValue?": "string >= 1",
	"multiple?": "boolean",
	"size?": "number.integer >= 1",
});

/**
 * Textarea Field Schema
 */
export const textareaFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'textarea'",
	"defaultValue?": "string >= 1",
	"rows?": "number.integer >= 1",
	"minLength?": "number.integer >= 0",
	"maxLength?": "number.integer >= 0",
	"trim?": "boolean",
});

/**
 * File Field Schema
 */
export const fileFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'file'",
	"accept?": "string >= 1",
	"multiple?": "boolean",
	"capture?": "'user' | 'environment'",
	"maxSize?": "number.integer >= 0",
});

/**
 * Hidden Field Schema
 */
export const hiddenFieldSchema = type({
	name: "string.alphanumeric >= 1",
	"label?": "string >= 1",
	"placeholder?": "string >= 1",
	"helpText?": "string >= 1",
	"disabled?": "boolean",
	"readonly?": "boolean",
	"autocomplete?": "string >= 1",
	type: "'hidden'",
	"defaultValue?": "string >= 1",
});
