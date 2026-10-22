// Table Column Schemas - Special column types
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Actions Column Schema
 */
export const actionsColumnSchema = type({
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
	type: "'actions'",
	items: "unknown",
});

/**
 * Custom Column Schema
 */
export const customColumnSchema = type({
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
	type: "'custom'",
	render: "unknown",
});

/**
 * Column Definition Schema (union of all column types)
 */
export const columnDefSchema = type("unknown");
