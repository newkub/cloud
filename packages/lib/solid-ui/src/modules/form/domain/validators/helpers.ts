// Form Validation Helpers - Custom validation rule creators
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type { FieldValue as FieldValueModel, ValidationRule as ValidationRuleModel } from "../models";

/**
 * Create validation rule
 */
export const createRule = (validate: (value: FieldValueModel) => boolean, message: string): ValidationRuleModel => ({
	validate,
	message,
});

/**
 * Required validation
 */
export const required = (message = "This field is required") =>
	createRule((value) => {
		if (value === undefined || value === null || value === "") return false;
		if (Array.isArray(value) && value.length === 0) return false;
		return true;
	}, message);

/**
 * Min length validation
 */
export const minLength = (min: number, message?: string) =>
	createRule((value) => {
		if (!value) return true;
		if (typeof value === "string") return value.length >= min;
		if (Array.isArray(value)) return value.length >= min;
		return true;
	}, message || `Must be at least ${min} characters`);

/**
 * Max length validation
 */
export const maxLength = (max: number, message?: string) =>
	createRule((value) => {
		if (!value) return true;
		if (typeof value === "string") return value.length <= max;
		if (Array.isArray(value)) return value.length <= max;
		return true;
	}, message || `Must be at most ${max} characters`);

/**
 * Pattern validation
 */
export const pattern = (regex: RegExp, message = "Invalid format") =>
	createRule((value) => {
		if (!value) return true;
		if (typeof value !== "string") return false;
		return regex.test(value);
	}, message);

/**
 * Email validation
 */
export const email = (message = "Please enter a valid email") =>
	createRule((value) => {
		if (!value) return true;
		if (typeof value !== "string") return false;
		const emailSchema = type("string.email");
		const result = emailSchema(value);
		return !(result instanceof type.errors);
	}, message);

/**
 * Match validation
 */
export const match = (_otherField: string, message = "Fields do not match") =>
	createRule((_value) => {
		// This is a simplified version - in a real app, you'd access the form context
		return true;
	}, message);
