// Chart Data Domain Schemas - Arktype validation schemas
// Following /follow-arktype workflow for type-safe runtime validation

import { type } from "arktype";
import type { ChartData, ChartDataset, ValidationResult } from "../../types/index";

/**
 * Chart Dataset Schema
 */
export const chartDatasetSchema = type({
	label: "string >= 1",
	data: "number[]",
}).narrow((dataset) => dataset.data.length >= 1);

export type ChartDatasetSchema = typeof chartDatasetSchema.infer;

/**
 * Chart Data Schema
 */
export const chartDataSchema = type({
	labels: "string[]",
	datasets: chartDatasetSchema.array(),
}).narrow((data) => data.labels.length >= 1 && data.datasets.length >= 1);

export type ChartDataSchema = typeof chartDataSchema.infer;

/**
 * Validate chart data using Arktype
 */
export const validateChartData = (data: unknown): ValidationResult => {
	const errors: string[] = [];

	const result = chartDataSchema(data);
	if (result instanceof type.errors) {
		errors.push(result.summary);
		return { isValid: false, errors };
	}

	const chartData = result as ChartData;

	// Check dataset consistency
	chartData.datasets.forEach((dataset: ChartDataset, index: number) => {
		if (dataset.data.length !== chartData.labels.length) {
			errors.push(
				`Dataset ${index} data length (${dataset.data.length}) does not match labels length (${chartData.labels.length})`,
			);
		}

		// Check for valid numbers
		dataset.data.forEach((value: number, valueIndex: number) => {
			if (typeof value !== "number" || Number.isNaN(value)) {
				errors.push(`Dataset ${index}, value ${valueIndex} is not a valid number`);
			}
		});
	});

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Validate dataset using Arktype
 */
export const validateDataset = (dataset: unknown): ValidationResult => {
	const errors: string[] = [];

	const result = chartDatasetSchema(dataset);
	if (result instanceof type.errors) {
		errors.push(result.summary);
		return { isValid: false, errors };
	}

	const datasetData = result as ChartDataset;

	// Check for valid numbers
	datasetData.data.forEach((value: number, index: number) => {
		if (typeof value !== "number" || Number.isNaN(value)) {
			errors.push(`Data point ${index} is not a valid number`);
		}

		if (typeof value === "number" && !Number.isFinite(value)) {
			errors.push(`Data point ${index} must be finite`);
		}
	});

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Validate value range using Arktype
 */
export const validateValueRange = (
	value: unknown,
	min: number = -Infinity,
	max: number = Infinity,
): ValidationResult => {
	const errors: string[] = [];

	const valueSchema = type("number").narrow((v) => {
		if (Number.isNaN(v)) return false;
		if (!Number.isFinite(v)) return false;
		if (v < min) return false;
		if (v > max) return false;
		return true;
	});

	const result = valueSchema(value);
	if (result instanceof type.errors) {
		errors.push(result.summary);
	} else {
		const numValue = result as number;
		if (numValue < min) {
			errors.push(`Value ${numValue} is below minimum ${min}`);
		}
		if (numValue > max) {
			errors.push(`Value ${numValue} is above maximum ${max}`);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

/**
 * Validate labels using Arktype
 */
export const validateLabels = (labels: unknown): ValidationResult => {
	const errors: string[] = [];

	const labelsSchema = type("string[]");
	const result = labelsSchema(labels);
	if (result instanceof type.errors) {
		errors.push(result.summary);
		return { isValid: false, errors };
	}

	const labelsData = result as string[];

	if (labelsData.length === 0) {
		errors.push("At least one label is required");
		return { isValid: false, errors };
	}

	labelsData.forEach((label: string, index: number) => {
		if (label.trim() === "") {
			errors.push(`Label ${index} cannot be empty`);
		}
	});

	// Check for duplicates
	const uniqueLabels = new Set(labelsData.map((l) => l.trim().toLowerCase()));
	if (uniqueLabels.size !== labelsData.length) {
		errors.push("Labels must be unique (case-insensitive)");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};
