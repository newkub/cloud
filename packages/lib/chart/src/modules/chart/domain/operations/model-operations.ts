// Chart model operations
import type { ChartData, ChartDataset, ChartOptions, ChartType } from "../../types/index";
import type { ChartModel } from "../models/chart-model";
import { getDefaultOptions } from "../models/chart-model";

export const updateChartData = (chart: ChartModel, newData: ChartData, now: number = Date.now()): ChartModel => ({
	...chart,
	data: newData,
	metadata: {
		...chart.metadata,
		updatedAt: now,
	},
});

export const updateChartOptions = (
	chart: ChartModel,
	newOptions: ChartOptions,
	now: number = Date.now(),
): ChartModel => ({
	...chart,
	options: { ...chart.options, ...newOptions },
	metadata: {
		...chart.metadata,
		updatedAt: now,
	},
});

export const updateChartType = (chart: ChartModel, newType: ChartType, now: number = Date.now()): ChartModel => ({
	...chart,
	type: newType,
	options: getDefaultOptions(newType),
	metadata: {
		...chart.metadata,
		type: newType,
		updatedAt: now,
	},
});

// Chart equality
export const areChartsEqual = (chart1: ChartModel, chart2: ChartModel): boolean => {
	return (
		chart1.id === chart2.id &&
		chart1.type === chart2.type &&
		JSON.stringify(chart1.data) === JSON.stringify(chart2.data) &&
		JSON.stringify(chart1.options) === JSON.stringify(chart2.options)
	);
};

// Chart cloning
export const cloneChart = (chart: ChartModel): ChartModel => ({
	...chart,
	data: {
		...chart.data,
		datasets: chart.data.datasets.map((dataset: ChartDataset) => ({
			...dataset,
		})),
	},
	options: { ...chart.options },
	metadata: { ...chart.metadata },
});
