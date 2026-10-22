// Table Module - Type Aliases
// Clean Architecture: Type definitions for column and filter types

export type ColumnType =
	| "string"
	| "number"
	| "boolean"
	| "date"
	| "datetime"
	| "time"
	| "currency"
	| "percent"
	| "email"
	| "url"
	| "image"
	| "badge"
	| "tag"
	| "avatar"
	| "actions"
	| "custom";

export type FilterOperator =
	| "eq" // equals
	| "neq" // not equals
	| "gt" // greater than
	| "gte" // greater than or equal
	| "lt" // less than
	| "lte" // less than or equal
	| "contains"
	| "startsWith"
	| "endsWith"
	| "in"
	| "notIn"
	| "isNull"
	| "isNotNull";
