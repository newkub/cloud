// Chart Config Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type { ChartConfig, ChartOptions, ValidationResult } from "../../types/index";
import { validateChartData } from "./data-validators";
import { validateChartType } from "./type-validators";

/**
 * Chart Config Schema
 */
export const chartConfigSchema = type({
	type: "'pie' | 'gauge' | 'line' | 'bar' | 'geographic'",
	data: "unknown",
	"options?": "unknown",
});

export type ChartConfigSchema = typeof chartConfigSchema.infer;

/**
 * Chart Options Schema
 */
export const chartOptionsSchema = type({
	"title?": "string >= 1",
	"theme?": "string",
	"renderer?": "'canvas' | 'svg'",
});

export type ChartOptionsSchema = typeof chartOptionsSchema.infer;

/**
 * Color Schema
 */
export const colorSchema = type(
	`/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ | 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | 'pink' | 'cyan' | 'magenta' | 'black' | 'white' | 'gray'`,
);

export type ColorSchema = typeof colorSchema.infer;

/**
 * Validate chart config using Arktype
 */
export const validateChartConfig = (config: unknown): ValidationResult => {
	const errors: string[] = [];

	const result = chartConfigSchema(config);
	if (result instanceof type.errors) {
		errors.push(result.summary);
		return { isValid: false, errors };
	}

	const configData = result as ChartConfig;

	if (configData.data) {
		const dataValidation = validateChartData(configData.data);
		errors.push(...dataValidation.errors);

		const typeValidation = validateChartType(configData.type, configData.data);
		errors.push(...typeValidation.errors);
	}

	if (configData.options) {
		const options = configData.options as ChartOptions;
		if (options.title && options.title.trim() === "") {
			errors.push("Chart title cannot be empty");
		}

		const optionsResult = chartOptionsSchema(configData.options);
		if (optionsResult instanceof type.errors) {
			errors.push(optionsResult.summary);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Validate color using Arktype
 */
export const validateColor = (color: unknown): ValidationResult => {
	const result = colorSchema(color);
	if (result instanceof type.errors) {
		return {
			isValid: false,
			errors: [`Invalid color format: ${result.summary}`],
		};
	}
	return { isValid: true, errors: [] };
};
