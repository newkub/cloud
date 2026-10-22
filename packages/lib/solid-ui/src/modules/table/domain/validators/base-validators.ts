// Table Base Validators - Core type validators
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import { baseColumnSchema, columnTypeSchema, filterOperatorSchema } from "./schemas/base";

export const validateColumnType = (value: unknown): value is typeof columnTypeSchema.infer => {
	const result = columnTypeSchema(value);
	return !(result instanceof type.errors);
};

export const validateFilterOperator = (value: unknown): value is typeof filterOperatorSchema.infer => {
	const result = filterOperatorSchema(value);
	return !(result instanceof type.errors);
};

export const validateBaseColumn = (value: unknown): value is typeof baseColumnSchema.infer => {
	const result = baseColumnSchema(value);
	return !(result instanceof type.errors);
};
