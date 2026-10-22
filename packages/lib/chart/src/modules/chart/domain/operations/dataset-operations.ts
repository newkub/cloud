// Dataset model operations
import type { ChartDataset } from "../../types/index";
import type { ChartModel } from "../models/chart-model";

export const createDataset = (
	label: string,
	data: readonly number[],
	options?: {
		readonly color?: string;
		readonly backgroundColor?: string;
		readonly borderColor?: string;
	},
): ChartDataset => ({
	label,
	data,
	...(options?.color !== undefined && { color: options.color }),
	...(options?.backgroundColor !== undefined && {
		backgroundColor: options.backgroundColor,
	}),
	...(options?.borderColor !== undefined && {
		borderColor: options.borderColor,
	}),
});

export const addDataset = (chart: ChartModel, dataset: ChartDataset, now: number = Date.now()): ChartModel => ({
	...chart,
	data: {
		...chart.data,
		datasets: [...chart.data.datasets, dataset],
	},
	metadata: {
		...chart.metadata,
		updatedAt: now,
	},
});

export const removeDataset = (chart: ChartModel, index: number, now: number = Date.now()): ChartModel => ({
	...chart,
	data: {
		...chart.data,
		datasets: chart.data.datasets.filter((_: ChartDataset, i: number) => i !== index),
	},
	metadata: {
		...chart.metadata,
		updatedAt: now,
	},
});

export const updateDataset = (
	chart: ChartModel,
	index: number,
	updater: (dataset: ChartDataset) => ChartDataset,
	now: number = Date.now(),
): ChartModel => {
	const datasets = [...chart.data.datasets];
	if (index >= 0 && index < datasets.length) {
		const dataset = datasets[index];
		if (dataset) {
			datasets[index] = updater(dataset);
		}
	}
	return {
		...chart,
		data: {
			...chart.data,
			datasets,
		},
		metadata: {
			...chart.metadata,
			updatedAt: now,
		},
	};
};
