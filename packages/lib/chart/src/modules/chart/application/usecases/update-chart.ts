// Update chart use case - functional implementation

import type { ChartResponse, UpdateChartRequest } from "../../types/index";
import { updateChartData, validateChart } from "../../domain/models/chart";
import type { ChartModel } from "../../domain/models/chart-model";
import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../ports/chart-ports";

// Pure function for updating a chart
export const updateChartUseCase =
	(renderer: IChartRenderer, repository: IChartRepository, eventHandler: IChartEventHandler) =>
	async (request: UpdateChartRequest, now: number = Date.now()): Promise<ChartResponse> => {
		try {
			// Find existing chart
			const existingChart = await repository.findById(request.chartId);
			if (!existingChart) {
				return {
					success: false,
					error: `Chart with ID ${request.chartId} not found`,
				};
			}

			// Update chart data
			const updatedChart = updateChartData(existingChart as ChartModel, request.data);

			// Validate updated chart
			const validation = validateChart(updatedChart);
			if (!validation.isValid) {
				return {
					success: false,
					error: `Invalid chart data: ${validation.errors.join(", ")}`,
				};
			}

			// Save updated chart
			const saveResult = await repository.update(request.chartId, updatedChart);
			if (!saveResult.success) {
				return {
					success: false,
					error: "Failed to save updated chart",
				};
			}

			// Update renderer
			const renderResult = await renderer.update(request.data);
			if (!renderResult.success) {
				return {
					success: false,
					error: "Failed to update chart renderer",
				};
			}

			// Emit update event
			eventHandler.emit("chart:updated", {
				chartId: request.chartId,
				data: request.data,
				timestamp: now,
			});

			return {
				success: true,
				chartId: request.chartId,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error during chart update",
			};
		}
	};

// Batch update use case
export const batchUpdateChartsUseCase =
	(repository: IChartRepository, eventHandler: IChartEventHandler) =>
	async (requests: readonly UpdateChartRequest[], now: number = Date.now()): Promise<ChartResponse> => {
		const results: { chartId: string; success: boolean; error?: string }[] = [];

		try {
			for (const request of requests) {
				const existingChart = await repository.findById(request.chartId);
				if (!existingChart) {
					results.push({
						chartId: request.chartId,
						success: false,
						error: "Chart not found",
					});
					continue;
				}

				const updatedChart = updateChartData(existingChart as ChartModel, request.data);
				const validation = validateChart(updatedChart);

				if (!validation.isValid) {
					results.push({
						chartId: request.chartId,
						success: false,
						error: `Validation failed: ${validation.errors.join(", ")}`,
					});
					continue;
				}

				const saveResult = await repository.update(request.chartId, updatedChart);
				results.push({
					chartId: request.chartId,
					success: saveResult.success,
					...(saveResult.success ? {} : { error: "Failed to save" }),
				});
			}

			const successCount = results.filter((r) => r.success).length;
			const totalCount = results.length;

			// Emit batch update event
			eventHandler.emit("charts:batch-updated", {
				results,
				successCount,
				totalCount,
				timestamp: now,
			});

			return {
				success: successCount === totalCount,
				...(successCount !== totalCount && {
					error: `${totalCount - successCount} charts failed to update`,
				}),
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error during batch update",
			};
		}
	};
