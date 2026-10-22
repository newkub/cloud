// Pure chart calculation operations

import type { ChartDataset, ChartPoint, GaugeThreshold } from "../../types/index";

// Pure utility functions (inlined to avoid shared dependency)
const clamp =
	(min: number, max: number) =>
	(value: number): number =>
		Math.min(Math.max(value, min), max);

const round =
	(precision: number) =>
	(value: number): number =>
		Math.round(value * 10 ** precision) / 10 ** precision;

// Data bounds calculation
export const calculateDataBounds = (datasets: readonly ChartDataset[]): { min: number; max: number } => {
	if (datasets.length === 0) return { min: 0, max: 100 };

	const allValues = datasets.flatMap((dataset) => dataset.data);
	const min = Math.min(...allValues);
	const max = Math.max(...allValues);

	return { min, max };
};

// Percentage calculations
export const calculatePercentage = (value: number, min: number, max: number): number => {
	if (max <= min) return 0;
	return clamp(0, 1)((value - min) / (max - min));
};

export const calculateGaugePercentage = calculatePercentage;

// Interpolation functions
export const interpolateValue = (start: number, end: number, progress: number): number => {
	return start + (end - start) * clamp(0, 1)(progress);
};

export const easeInOutCubic = (t: number): number => {
	const clampedT = clamp(0, 1)(t);
	return clampedT < 0.5 ? 4 * clampedT * clampedT * clampedT : 1 - (-2 * clampedT + 2) ** 3 / 2;
};

export const smoothStep = (edge0: number, edge1: number, x: number): number => {
	const t = clamp(0, 1)((x - edge0) / (edge1 - edge0));
	return t * t * (3 - 2 * t);
};

// Angle calculations
export const calculateAngle = (
	percentage: number,
	startAngle: number = -Math.PI,
	endAngle: number = Math.PI,
): number => {
	return startAngle + (endAngle - startAngle) * clamp(0, 1)(percentage);
};

// Coordinate transformations
export const polarToCartesian = (centerX: number, centerY: number, radius: number, angle: number): ChartPoint => ({
	x: centerX + radius * Math.cos(angle),
	y: centerY + radius * Math.sin(angle),
});

// Threshold operations
export const findThreshold = (value: number, thresholds: readonly GaugeThreshold[]): GaugeThreshold | null => {
	for (const threshold of thresholds) {
		if (value <= threshold.value) {
			return threshold;
		}
	}
	return null;
};

// Statistical calculations
export const calculateMean = (values: readonly number[]): number => {
	if (values.length === 0) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const calculateMedian = (values: readonly number[]): number => {
	if (values.length === 0) return 0;

	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);

	return sorted.length % 2 === 0 ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2 : (sorted[mid] ?? 0);
};

export const calculateStandardDeviation = (values: readonly number[]): number => {
	if (values.length === 0) return 0;

	const mean = calculateMean(values);
	const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

	return Math.sqrt(variance);
};

// Data aggregation
export const aggregateData = (
	data: readonly number[],
	method: "sum" | "mean" | "median" | "min" | "max" | "count",
): number => {
	switch (method) {
		case "sum":
			return data.reduce((sum, value) => sum + value, 0);
		case "mean":
			return calculateMean(data);
		case "median":
			return calculateMedian(data);
		case "min":
			return Math.min(...data);
		case "max":
			return Math.max(...data);
		case "count":
			return data.length;
		default:
			return 0;
	}
};

// Additional aggregation functions
export const calculateSum = (data: readonly number[]): number => {
	return data.reduce((sum, value) => sum + value, 0);
};

export const calculateMin = (data: readonly number[]): number => {
	return data.length > 0 ? Math.min(...data) : 0;
};

export const calculateMax = (data: readonly number[]): number => {
	return data.length > 0 ? Math.max(...data) : 0;
};

export const calculateCount = (data: readonly number[]): number => {
	return data.length;
};

// Group data by key
export const groupData = <T, K extends keyof T>(data: readonly T[], key: K): Record<string, readonly T[]> => {
	return data.reduce(
		(groups, item) => {
			const groupKey = String(item[key]);
			if (!groups[groupKey]) {
				groups[groupKey] = [];
			}
			(groups[groupKey] as T[]).push(item);
			return groups;
		},
		{} as Record<string, T[]>,
	);
};

// Aggregate grouped data
export const aggregateGroupedData = <T, K extends keyof T>(
	data: readonly T[],
	key: K,
	aggregationMethod: "sum" | "mean" | "median" | "min" | "max" | "count",
	valueKey: K,
): Record<string, number> => {
	const grouped = groupData(data, key);
	const result: Record<string, number> = {};

	for (const [groupKey, items] of Object.entries(grouped)) {
		const values = items.map((item) => Number(item[valueKey]));
		result[groupKey] = aggregateData(values, aggregationMethod);
	}

	return result;
};

// Normalization
export const normalizeData = (data: readonly number[], min: number, max: number): readonly number[] => {
	if (max <= min) return data.map(() => 0);
	return data.map((value) => clamp(0, 1)((value - min) / (max - min)));
};

// Rounding utilities
export const roundToPrecision = round(2);

// Data smoothing
export const smoothData = (data: readonly number[], windowSize: number = 3): readonly number[] => {
	if (windowSize <= 1 || data.length < windowSize) return data;

	const halfWindow = Math.floor(windowSize / 2);
	return data.map((_, index) => {
		const start = Math.max(0, index - halfWindow);
		const end = Math.min(data.length, index + halfWindow + 1);
		const window = data.slice(start, end);
		return calculateMean(window);
	});
};
