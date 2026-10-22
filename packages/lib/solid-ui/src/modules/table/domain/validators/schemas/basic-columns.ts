// Table Column Schemas - Basic column types
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Text Column Schema
 */
export const textColumnSchema = type({
	key: "string.alphanumeric >= 1",
	header: "string >= 1",
	"width?": "string | number",
	"minWidth?": "string >= 1",
	"maxWidth?": "string >= 1",
	"sortable?": "boolean",
	"filterable?": "boolean",
	"hidden?": "boolean",
	"sticky?": "boolean",
	"align?": "'left' | 'center' | 'right'",
	"verticalAlign?": "'top' | 'middle' | 'bottom'",
	type: "'string'",
	"truncate?": "boolean",
	"maxLength?": "number.integer >= 0",
	"uppercase?": "boolean",
	"lowercase?": "boolean",
});

/**
 * Number Column Schema
 */
export const numberColumnSchema = type({
	key: "string.alphanumeric >= 1",
	header: "string >= 1",
	"width?": "string | number",
	"minWidth?": "string >= 1",
	"maxWidth?": "string >= 1",
	"sortable?": "boolean",
	"filterable?": "boolean",
	"hidden?": "boolean",
	"sticky?": "boolean",
	"align?": "'left' | 'center' | 'right'",
	"verticalAlign?": "'top' | 'middle' | 'bottom'",
	type: "'number'",
	"format?": "'decimal' | 'integer' | 'percent' | 'currency'",
	"currency?": "string >= 1",
	"locale?": "string >= 1",
	"minFractionDigits?": "number.integer >= 0",
	"maxFractionDigits?": "number.integer >= 0",
});

/**
 * Boolean Column Schema
 */
export const booleanColumnSchema = type({
	key: "string.alphanumeric >= 1",
	header: "string >= 1",
	"width?": "string | number",
	"minWidth?": "string >= 1",
	"maxWidth?": "string >= 1",
	"sortable?": "boolean",
	"filterable?": "boolean",
	"hidden?": "boolean",
	"sticky?": "boolean",
	"align?": "'left' | 'center' | 'right'",
	"verticalAlign?": "'top' | 'middle' | 'bottom'",
	type: "'boolean'",
	"trueLabel?": "string >= 1",
	"falseLabel?": "string >= 1",
	"trueColor?": "string >= 1",
	"falseColor?": "string >= 1",
});

/**
 * Date Column Schema
 */
export const dateColumnSchema = type({
	key: "string.alphanumeric >= 1",
	header: "string >= 1",
	"width?": "string | number",
	"minWidth?": "string >= 1",
	"maxWidth?": "string >= 1",
	"sortable?": "boolean",
	"filterable?": "boolean",
	"hidden?": "boolean",
	"sticky?": "boolean",
	"align?": "'left' | 'center' | 'right'",
	"verticalAlign?": "'top' | 'middle' | 'bottom'",
	type: "'date' | 'datetime' | 'time'",
	"format?": "string >= 1",
	"relative?": "boolean",
});
