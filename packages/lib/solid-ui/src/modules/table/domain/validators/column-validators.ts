// Table Column Validators - Column type validators
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import {
	actionsColumnSchema,
	avatarColumnSchema,
	badgeColumnSchema,
	booleanColumnSchema,
	columnDefSchema,
	currencyColumnSchema,
	customColumnSchema,
	dateColumnSchema,
	emailColumnSchema,
	imageColumnSchema,
	numberColumnSchema,
	percentColumnSchema,
	tagColumnSchema,
	textColumnSchema,
	urlColumnSchema,
} from "./schemas/columns";

export const validateTextColumn = (value: unknown): value is typeof textColumnSchema.infer => {
	const result = textColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateNumberColumn = (value: unknown): value is typeof numberColumnSchema.infer => {
	const result = numberColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateBooleanColumn = (value: unknown): value is typeof booleanColumnSchema.infer => {
	const result = booleanColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateDateColumn = (value: unknown): value is typeof dateColumnSchema.infer => {
	const result = dateColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateCurrencyColumn = (value: unknown): value is typeof currencyColumnSchema.infer => {
	const result = currencyColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validatePercentColumn = (value: unknown): value is typeof percentColumnSchema.infer => {
	const result = percentColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateEmailColumn = (value: unknown): value is typeof emailColumnSchema.infer => {
	const result = emailColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateUrlColumn = (value: unknown): value is typeof urlColumnSchema.infer => {
	const result = urlColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateImageColumn = (value: unknown): value is typeof imageColumnSchema.infer => {
	const result = imageColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateBadgeColumn = (value: unknown): value is typeof badgeColumnSchema.infer => {
	const result = badgeColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateTagColumn = (value: unknown): value is typeof tagColumnSchema.infer => {
	const result = tagColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateAvatarColumn = (value: unknown): value is typeof avatarColumnSchema.infer => {
	const result = avatarColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateActionsColumn = (value: unknown): value is typeof actionsColumnSchema.infer => {
	const result = actionsColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateCustomColumn = (value: unknown): value is typeof customColumnSchema.infer => {
	const result = customColumnSchema(value);
	return !(result instanceof type.errors);
};

export const validateColumnDef = (value: unknown): value is typeof columnDefSchema.infer => {
	const result = columnDefSchema(value);
	return !(result instanceof type.errors);
};
