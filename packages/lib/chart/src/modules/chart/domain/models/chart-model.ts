// Chart domain models (readonly, immutable)
import type { ChartConfig, ChartData, ChartOptions, ChartType } from "../../types/index";

// Chart model type
export interface ChartModel {
	readonly id: string;
	readonly type: ChartType;
	readonly data: ChartData;
	readonly options: ChartOptions;
	readonly metadata: {
		readonly id: string;
		readonly type: ChartType;
		readonly createdAt: number;
		readonly updatedAt: number;
		readonly version: string;
	};
}

// Chart model factory
export const createChart = (config: ChartConfig, now: number = Date.now()): ChartModel => ({
	id: generateChartId(),
	type: config.type,
	data: config.data,
	options: config.options || getDefaultOptions(config.type),
	metadata: {
		id: generateChartId(),
		type: config.type,
		createdAt: now,
		updatedAt: now,
		version: "1.0.0",
	},
});

// Helper functions
export const generateChartId = (now: number = Date.now(), random: () => number = Math.random): string =>
	`chart_${now}_${random().toString(36).substr(2, 9)}`;

export const getDefaultOptions = (type: ChartType): ChartOptions => {
	const baseOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		animation: true,
		legend: true,
		tooltip: true,
	};

	switch (type) {
		case "pie":
			return {
				...baseOptions,
				legend: true,
				tooltip: true,
			};
		case "gauge":
			return {
				...baseOptions,
				legend: false,
				tooltip: false,
			};
		default:
			return baseOptions;
	}
};

// Update chart data
export const updateChartData = (
	chart: ChartModel,
	newData: Partial<ChartData>,
	now: number = Date.now(),
): ChartModel => ({
	...chart,
	data: { ...chart.data, ...newData },
	metadata: {
		...chart.metadata,
		updatedAt: now,
	},
});

// Validate chart
export const validateChart = (
	chart: ChartModel,
): {
	isValid: boolean;
	errors: string[];
} => {
	const errors: string[] = [];

	if (!chart.data || Object.keys(chart.data).length === 0) {
		errors.push("Chart data is required");
	}

	if (!chart.type) {
		errors.push("Chart type is required");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};
