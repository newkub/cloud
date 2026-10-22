// Form Submission Schemas - Form submission and submit options schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";

/**
 * Form Submission Schema
 */
export const formSubmissionSchema = type({
	values: "Record<string, string | number | boolean | File | File[] | string[] | null | undefined>",
	errors: "Record<string, string[]>",
	isValid: "boolean",
	isSubmitting: "boolean",
	isSubmitted: "boolean",
	submitCount: "number.integer >= 0",
});

/**
 * Submit Options Schema
 */
export const submitOptionsSchema = type({
	"preventDefault?": "boolean",
	"validation?": "boolean",
});
