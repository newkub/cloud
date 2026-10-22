// Table Column Schemas - Display column types
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Badge Column Schema
 */
export const badgeColumnSchema = type({
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
	type: "'badge'",
	variants: "unknown",
	"defaultVariant?": "string >= 1",
});

/**
 * Tag Column Schema
 */
export const tagColumnSchema = type({
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
	type: "'tag'",
	variants: "unknown",
	"defaultVariant?": "string >= 1",
});

/**
 * Avatar Column Schema
 */
export const avatarColumnSchema = type({
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
	type: "'avatar'",
	"srcKey?": "string.alphanumeric >= 1",
	"altKey?": "string.alphanumeric >= 1",
	"nameKey?": "string.alphanumeric >= 1",
	"size?": "number.integer >= 0",
	"rounded?": "boolean",
});
