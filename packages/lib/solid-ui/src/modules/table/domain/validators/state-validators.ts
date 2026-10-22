// Table State Validators - State management validators
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import {
	filterableConfigSchema,
	filterStateSchema,
	paginationConfigSchema,
	paginationStateSchema,
	rowStateSchema,
	selectionStateSchema,
	sortableConfigSchema,
	sortDirectionSchema,
	sortStateSchema,
} from "./schemas/state";

export const validateSortDirection = (value: unknown): value is typeof sortDirectionSchema.infer => {
	const result = sortDirectionSchema(value);
	return !(result instanceof type.errors);
};

export const validateSortState = (value: unknown): value is typeof sortStateSchema.infer => {
	const result = sortStateSchema(value);
	return !(result instanceof type.errors);
};

export const validateSortableConfig = (value: unknown): value is typeof sortableConfigSchema.infer => {
	const result = sortableConfigSchema(value);
	return !(result instanceof type.errors);
};

export const validateFilterState = (value: unknown): value is typeof filterStateSchema.infer => {
	const result = filterStateSchema(value);
	return !(result instanceof type.errors);
};

export const validateFilterableConfig = (value: unknown): value is typeof filterableConfigSchema.infer => {
	const result = filterableConfigSchema(value);
	return !(result instanceof type.errors);
};

export const validateSelectionState = (value: unknown): value is typeof selectionStateSchema.infer => {
	const result = selectionStateSchema(value);
	return !(result instanceof type.errors);
};

export const validatePaginationState = (value: unknown): value is typeof paginationStateSchema.infer => {
	const result = paginationStateSchema(value);
	return !(result instanceof type.errors);
};

export const validatePaginationConfig = (value: unknown): value is typeof paginationConfigSchema.infer => {
	const result = paginationConfigSchema(value);
	return !(result instanceof type.errors);
};

export const validateRowState = (value: unknown): value is typeof rowStateSchema.infer => {
	const result = rowStateSchema(value);
	return !(result instanceof type.errors);
};
