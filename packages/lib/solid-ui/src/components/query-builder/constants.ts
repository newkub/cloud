import type { QueryOperator } from "./types";

export const ALL_OPS: QueryOperator[] = ["eq", "neq", "gt", "lt", "gte", "lte", "contains", "startsWith", "endsWith"];
export const OP_LABEL: Record<QueryOperator, string> = {
	eq: "=",
	neq: "≠",
	gt: ">",
	lt: "<",
	gte: "≥",
	lte: "≤",
	contains: "contains",
	startsWith: "starts",
	endsWith: "ends",
};

export const ctrl = {
	sm: "h-7 text-2xs",
	md: "h-8 text-xs",
	lg: "h-9 text-sm",
} as const;
