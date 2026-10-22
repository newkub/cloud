/**
 * Chart Workflows
 * Complex multi-step workflows for chart operations
 */

import type { ChartData, ChartOptions } from "../../types/index";

// Workflow for preparing chart data with validation
export const prepareChartDataWorkflow = async (
	rawData: unknown,
	options?: { validate?: boolean; transform?: (data: unknown) => ChartData },
): Promise<ChartData> => {
	let data = rawData;

	// Apply transformation if provided
	if (options?.transform) {
		data = options.transform(data);
	}

	// Basic validation
	if (options?.validate) {
		if (!data || typeof data !== "object") {
			throw new Error("Invalid chart data: must be an object");
		}
	}

	return data as ChartData;
};

// Workflow for merging chart options with defaults
export const mergeChartOptionsWorkflow = async (
	userOptions: ChartOptions,
	defaultOptions: ChartOptions,
): Promise<ChartOptions> => {
	return {
		...defaultOptions,
		...userOptions,
		responsive: userOptions.responsive ?? defaultOptions.responsive ?? true,
		maintainAspectRatio: userOptions.maintainAspectRatio ?? defaultOptions.maintainAspectRatio ?? true,
	};
};

// Workflow for exporting chart data
export const exportChartDataWorkflow = async (data: ChartData, format: "json" | "csv" = "json"): Promise<string> => {
	if (format === "json") {
		return JSON.stringify(data, null, 2);
	}

	if (format === "csv") {
		// Basic CSV export implementation
		const datasets = data.datasets || [];
		if (datasets.length === 0) return "";

		const headers = ["Label", ...datasets.map((d) => d.label || "Dataset")];
		const labels = data.labels || [];
		const rows = labels.map((label, i) => [label, ...datasets.map((d) => d.data?.[i] ?? "")]);

		return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
	}

	throw new Error(`Unsupported export format: ${format}`);
};
