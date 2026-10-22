// Table Base Schemas - Core type definitions
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Column Type Schema
 */
export const columnTypeSchema = type(
	"'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'time' | 'currency' | 'percent' | 'email' | 'url' | 'image' | 'badge' | 'tag' | 'avatar' | 'actions' | 'custom'",
);

/**
 * Filter Operator Schema
 */
export const filterOperatorSchema = type(
	"'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'isNull' | 'isNotNull'",
);

/**
 * Base Column Schema
 */
export const baseColumnSchema = type({
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
});
