// Form Validator Schemas - Arktype schemas for field validation
// Following /follow-arktype workflow for type-safe runtime validation

import type { Type } from "arktype";
import { type } from "arktype";

/**
 * Required Validator Schema
 */
export const requiredSchema = type("string | number | boolean | File | File[] | string[]");

/**
 * Email Validator Schema
 */
export const emailSchema = type("string.email");

/**
 * Min Length Validator Schema
 */
export const minLengthSchema = (min: number) => type(`string >= ${min} | unknown[] >= ${min}`);

/**
 * Max Length Validator Schema
 */
export const maxLengthSchema = (max: number) => type(`string <= ${max} | unknown[] <= ${max}`);

/**
 * Min Validator Schema
 */
export const minSchema = (min: number) => type(`number >= ${min}`);

/**
 * Max Validator Schema
 */
export const maxSchema = (max: number) => type(`number <= ${max}`);

/**
 * Pattern Validator Schema - Using regex literal with type inference
 */
export const patternSchema = (pattern: string) =>
	type("string").narrow((s, ctx) => {
		if (!s) return true;
		const regex = new RegExp(pattern);
		return regex.test(s) || ctx.mustBe("match pattern");
	});

/**
 * URL Validator Schema
 */
export const urlSchema = type("string.url");

/**
 * Phone Validator Schema - Using regex literal with type inference
 */
export const telSchema = type("string").narrow((s, ctx) => {
	if (!s) return true;
	const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
	return phoneRegex.test(s) || ctx.mustBe("valid phone number");
});

/**
 * Max Size Validator Schema
 */
export const maxSizeSchema = (maxSize: number) =>
	type({
		size: `number.integer <= ${maxSize}`,
	});

/**
 * File Type Validator Schema
 */
export const fileTypeSchema = () => type("string");

/**
 * Integer Validator Schema
 */
export const integerSchema = type("number.integer");

/**
 * Positive Validator Schema
 */
export const positiveSchema = type("number > 0");

/**
 * Alphanumeric Validator Schema
 */
export const alphanumericSchema = type("string.alphanumeric");

/**
 * Alpha Validator Schema - Using regex literal with type inference
 */
export const alphaSchema = type("string").narrow((s, ctx) => {
	if (!s) return true;
	return /^[a-zA-Z]+$/.test(s) || ctx.mustBe("letters only");
});

/**
 * Numeric Validator Schema - Using regex literal with type inference
 */
export const numericSchema = type("string").narrow((s, ctx) => {
	if (!s) return true;
	return /^[0-9]+$/.test(s) || ctx.mustBe("numbers only");
});

/**
 * JSON String Parser Schema - Using .pipe() for transformation
 */
export const jsonStringSchema: Type<unknown> = type("string.json.parse") as Type<unknown>;

/**
 * Date String Parser Schema - Using .pipe() for transformation
 */
export const dateStringSchema = type("string.date.parse");

/**
 * Semver String Schema - Using format keyword
 */
export const semverSchema = type("string.semver");

/**
 * ISO Date String Schema
 */
export const isoDateSchema = type("string");

/**
 * Base64 String Schema - Using format keyword
 */
export const base64Schema = type("string.base64");
