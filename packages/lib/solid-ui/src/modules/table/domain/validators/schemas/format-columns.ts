// Table Column Schemas - Format column types
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Currency Column Schema
 */
export const currencyColumnSchema = type({
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
	type: "'currency'",
	"currency?": "string >= 1",
	"locale?": "string >= 1",
});

/**
 * Percent Column Schema
 */
export const percentColumnSchema = type({
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
	type: "'percent'",
	"decimals?": "number.integer >= 0",
}).narrow((obj) => !obj.decimals || obj.decimals <= 10);
