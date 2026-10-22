// Table Config Schema - Table configuration definition
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import { baseColumnSchema } from "./base";

/**
 * Table Config Schema
 */
export const tableConfigSchema = type({
	data: "unknown[]",
	columns: baseColumnSchema.array().atLeastLength(1),
	rowKey: "string | number",
	"selectable?": "boolean",
	"multiSelect?": "boolean",
	"hoverable?": "boolean",
	"striped?": "boolean",
	"bordered?": "boolean",
	"compact?": "boolean",
	"fixedHeader?": "boolean",
	"maxHeight?": "string >= 1",
	"pageSize?": "number.integer >= 1",
	"pageSizes?": "number.integer[]",
	"showPagination?": "boolean",
	"showPageSizeSelector?": "boolean",
	"showPageInfo?": "boolean",
	"total?": "number.integer >= 0",
});
