// Pure chart transformation operations
import type { ChartData, ChartDataset, ChartPoint } from "../../types/index";

// Data transformations
export const transformDataset = (
	dataset: ChartDataset,
	transformFn: (value: number, index: number) => number,
): ChartDataset => ({
	...dataset,
	data: dataset.data.map(transformFn),
});

export const filterDataPoints = (
	dataset: ChartDataset,
	predicate: (value: number, index: number) => boolean,
): ChartDataset => ({
	...dataset,
	data: dataset.data.filter(predicate),
});

export const aggregateDatasets = (
	datasets: readonly ChartDataset[],
	aggregationFn: (values: readonly number[]) => number,
	label: string,
): ChartDataset => ({
	label,
	data:
		datasets[0]?.data.map((_: number, index: number) =>
			aggregationFn(datasets.map((dataset) => dataset.data[index] ?? 0)),
		) ?? [],
});

// Coordinate transformations
export const transformPoints = (
	points: readonly ChartPoint[],
	transformFn: (point: ChartPoint) => ChartPoint,
): readonly ChartPoint[] => points.map(transformFn);

export const scalePoints = (points: readonly ChartPoint[], scaleX: number, scaleY: number): readonly ChartPoint[] =>
	transformPoints(points, ({ x, y }) => ({
		x: x * scaleX,
		y: y * scaleY,
	}));

export const translatePoints = (points: readonly ChartPoint[], dx: number, dy: number): readonly ChartPoint[] =>
	transformPoints(points, ({ x, y }) => ({
		x: x + dx,
		y: y + dy,
	}));

// Data sorting
export const sortDatasetByValue = (dataset: ChartDataset, ascending: boolean = true): ChartDataset => ({
	...dataset,
	data: [...dataset.data].sort((a, b) => (ascending ? a - b : b - a)),
});

export const sortDataByLabel = (data: ChartData, labels: readonly string[]): ChartData => ({
	...data,
	labels,
	datasets: data.datasets.map((dataset) => ({
		...dataset,
		data: labels.map((label) => {
			const originalIndex = data.labels.indexOf(label);
			return originalIndex >= 0 ? (dataset.data[originalIndex] ?? 0) : 0;
		}),
	})),
});

// Data filtering
export const filterByThreshold = (
	dataset: ChartDataset,
	threshold: number,
	operator: ">" | "<" | ">=" | "<=" = ">",
): ChartDataset => {
	const predicate = (value: number) => {
		switch (operator) {
			case ">":
				return value > threshold;
			case "<":
				return value < threshold;
			case ">=":
				return value >= threshold;
			case "<=":
				return value <= threshold;
			default:
				return true;
		}
	};

	return filterDataPoints(dataset, predicate);
};

export const filterByIndex = (dataset: ChartDataset, indices: readonly number[]): ChartDataset => ({
	...dataset,
	data: indices.map((index) => dataset.data[index] || 0),
});

// Data normalization
export const normalizeDataset = (dataset: ChartDataset, method: "minmax" | "zscore" = "minmax"): ChartDataset => {
	switch (method) {
		case "minmax": {
			const min = Math.min(...dataset.data);
			const max = Math.max(...dataset.data);
			const range = max - min;
			return transformDataset(dataset, (value) => (range === 0 ? 0 : (value - min) / range));
		}
		case "zscore": {
			const mean = dataset.data.reduce((sum: number, val: number) => sum + val, 0) / dataset.data.length;
			const stdDev = Math.sqrt(
				dataset.data.reduce((sum: number, val: number) => sum + (val - mean) ** 2, 0) / dataset.data.length,
			);
			return transformDataset(dataset, (value: number) => (stdDev === 0 ? 0 : (value - mean) / stdDev));
		}
		default:
			return dataset;
	}
};

// Data resampling
export const resampleData = (
	dataset: ChartDataset,
	targetLength: number,
	method: "linear" | "nearest" = "linear",
): ChartDataset => {
	if (dataset.data.length <= targetLength) return dataset;

	const sourceLength = dataset.data.length;
	const step = sourceLength / targetLength;

	return {
		...dataset,
		data: Array.from({ length: targetLength }, (_, i) => {
			const sourceIndex = i * step;
			const lowerIndex = Math.floor(sourceIndex);
			const upperIndex = Math.min(lowerIndex + 1, sourceLength - 1);

			if (method === "nearest") {
				return sourceIndex - lowerIndex < 0.5 ? (dataset.data[lowerIndex] ?? 0) : (dataset.data[upperIndex] ?? 0);
			} else {
				const fraction = sourceIndex - lowerIndex;
				return (dataset.data[lowerIndex] ?? 0) * (1 - fraction) + (dataset.data[upperIndex] ?? 0) * fraction;
			}
		}),
	};
};

// Data merging
export const mergeDatasets = (
	datasets: readonly ChartDataset[],
	mergeMethod: "add" | "average" | "max" | "min" = "add",
): ChartDataset => {
	if (datasets.length === 0) {
		return { label: "merged", data: [] };
	}

	const maxLength = Math.max(...datasets.map((d) => d.data.length));
	const mergedData = Array.from({ length: maxLength }, (_, index) => {
		const values = datasets.map((d) => d.data[index] ?? 0);

		switch (mergeMethod) {
			case "add":
				return values.reduce((sum, val) => sum + val, 0);
			case "average":
				return values.reduce((sum, val) => sum + val, 0) / values.length;
			case "max":
				return Math.max(...values);
			case "min":
				return Math.min(...values);
			default:
				return 0;
		}
	});

	return {
		label: "merged",
		data: mergedData,
	};
};
