// Form Validation Schemas - Validation rule and result schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Validation Rule Schema
 * Note: validate function uses "unknown" as Arktype is for data validation, not function signatures
 */
export const validationRuleSchema = type({
	validate: "unknown",
	message: "string >= 1",
});

/**
 * Validation Result Schema
 */
export const validationResultSchema = type({
	valid: "boolean",
	errors: "string[]",
});
