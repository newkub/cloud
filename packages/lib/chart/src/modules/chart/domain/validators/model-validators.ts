// Chart validation functions
import type { ChartDataset, ValidationResult } from "../../types/index";
import type { ChartModel } from "../models/chart-model";

export const validateChart = (chart: ChartModel): ValidationResult => {
	const errors: string[] = [];

	// Validate data
	if (chart.data.labels.length === 0) {
		errors.push("Chart must have at least one label");
	}

	if (chart.data.datasets.length === 0) {
		errors.push("Chart must have at least one dataset");
	}

	// Validate dataset consistency
	chart.data.datasets.forEach((dataset: ChartDataset, index: number) => {
		if (dataset.data.length !== chart.data.labels.length) {
			errors.push(
				`Dataset ${index} data length (${dataset.data.length}) does not match labels length (${chart.data.labels.length})`,
			);
		}

		if (dataset.label.trim() === "") {
			errors.push(`Dataset ${index} must have a non-empty label`);
		}
	});

	// Validate chart type specific requirements
	if (chart.type === "pie" && chart.data.datasets.length > 1) {
		errors.push("Pie chart can only have one dataset");
	}

	const firstDataset = chart.data.datasets[0];
	if (chart.type === "gauge" && firstDataset && firstDataset.data.length !== 1) {
		errors.push("Gauge chart must have exactly one data point");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};
