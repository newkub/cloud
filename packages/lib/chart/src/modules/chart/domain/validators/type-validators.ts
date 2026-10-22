// Chart Type Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type { ChartData, ChartType, ValidationResult } from "../../types/index";

/**
 * Chart Type Schema
 */
export const chartTypeSchema = type("'pie' | 'gauge' | 'line' | 'bar' | 'geographic'");

export type ChartTypeSchema = typeof chartTypeSchema.infer;

/**
 * Validate chart type using Arktype
 */
export const validateChartType = (type: ChartType, data: ChartData): ValidationResult => {
	const errors: string[] = [];

	switch (type) {
		case "pie":
			if (data.datasets.length > 1) {
				errors.push("Pie chart can only have one dataset");
			}

			if (data.datasets.length === 1) {
				const dataset = data.datasets[0];
				if (dataset) {
					const hasNegativeValues = dataset.data.some((value: number) => value < 0);
					if (hasNegativeValues) {
						errors.push("Pie chart cannot have negative values");
					}
				}
			}
			break;

		case "gauge":
			if (data.datasets.length !== 1) {
				errors.push("Gauge chart must have exactly one dataset");
			}

			if (data.datasets.length === 1) {
				const dataset = data.datasets[0];
				if (dataset && dataset.data.length !== 1) {
					errors.push("Gauge chart must have exactly one data point");
				}
			}
			break;

		case "line":
		case "bar":
			if (data.datasets.length === 0) {
				errors.push(`${type} chart must have at least one dataset`);
			}
			break;

		case "geographic":
			if (data.datasets.length === 0) {
				errors.push("Geographic chart must have at least one dataset");
			}
			break;
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};
