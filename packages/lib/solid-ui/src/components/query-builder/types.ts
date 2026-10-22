export interface QueryField {
	key: string;
	label: string;
	/** Allowed operators for this field — defaults to `operators` prop, then all. */
	operators?: QueryOperator[];
	/** Value input type. @default "text" */
	type?: "text" | "number" | "select";
	/** Options for type="select". */
	options?: { value: string; label: string }[];
}

export type QueryOperator = "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains" | "startsWith" | "endsWith";

export type QueryCombinator = "and" | "or";

export interface QueryRule {
	field: string;
	operator: QueryOperator;
	value: string;
}

/** A group of rules joined by its own combinator. */
export interface QueryGroup {
	combinator: QueryCombinator;
	rules: QueryRule[];
}

export type QueryNode = QueryRule | QueryGroup;

/** Narrow a node to a group. */
export function isQueryGroup(node: QueryNode): node is QueryGroup {
	return "rules" in node;
}

/** UI text overrides for QueryBuilder. */
export interface QueryBuilderLabels {
	addRule?: string;
	addGroup?: string;
	removeRule?: string;
	removeGroup?: string;
	clearValue?: string;
	clearAll?: string;
	empty?: string;
	/** Conjunction label between top-level nodes. @default "AND" */
	conjunction?: string;
	/** First-node label. @default "WHERE" */
	where?: string;
}
