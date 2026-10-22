// Table Column Schemas - Media column types
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Image Column Schema
 */
export const imageColumnSchema = type({
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
	type: "'image'",
	"altKey?": "string.alphanumeric >= 1",
	"imageWidth?": "number.integer >= 0",
	"imageHeight?": "number.integer >= 0",
	"rounded?": "boolean",
	"circle?": "boolean",
});
