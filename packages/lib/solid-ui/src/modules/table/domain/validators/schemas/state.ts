// Table State Schemas - State management definitions
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Sort Direction Schema
 */
export const sortDirectionSchema = type("'asc' | 'desc' | 'null'");

/**
 * Sort State Schema
 */
export const sortStateSchema = type({
	column: "string.alphanumeric >= 1",
	direction: "'asc' | 'desc' | 'null'",
});

/**
 * Sortable Config Schema
 */
export const sortableConfigSchema = type({
	"multiSort?": "boolean",
	"initialSort?": sortStateSchema,
});

/**
 * Filter State Schema
 */
export const filterStateSchema = type({
	column: "string.alphanumeric >= 1",
	operator:
		"'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'isNull' | 'isNotNull'",
	value: "string | number | boolean | null",
});

/**
 * Filterable Config Schema
 */
export const filterableConfigSchema = type({
	"globalFilter?": "boolean",
	"filterPlaceholder?": "string >= 1",
});

/**
 * Selection State Schema
 */
export const selectionStateSchema = type({
	selectedRows: "(string | number)[]",
	allSelected: "boolean",
	someSelected: "boolean",
});

/**
 * Pagination State Schema
 */
export const paginationStateSchema = type({
	page: "number.integer >= 1",
	pageSize: "number.integer >= 1",
	total: "number.integer >= 0",
	totalPages: "number.integer >= 0",
});

/**
 * Pagination Config Schema
 */
export const paginationConfigSchema = type({
	"page?": "number.integer >= 1",
	"pageSize?": "number.integer >= 1",
	"pageSizes?": "number.integer[]",
	"showPageSizeSelector?": "boolean",
	"showPageInfo?": "boolean",
	"showTotal?": "boolean",
});

/**
 * Row State Schema
 */
export const rowStateSchema = type({
	selected: "boolean",
	expanded: "boolean",
	hovered: "boolean",
	disabled: "boolean",
});
