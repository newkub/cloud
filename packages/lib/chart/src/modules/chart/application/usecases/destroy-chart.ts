// Destroy chart use case - functional implementation

import type { ChartResponse } from "../../types/index";
import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../ports/chart-ports";

// Pure function for destroying a chart
export const destroyChartUseCase =
	(renderer: IChartRenderer, repository: IChartRepository, eventHandler: IChartEventHandler) =>
	async (chartId: string, now: number = Date.now()): Promise<ChartResponse> => {
		try {
			// Find existing chart
			const existingChart = await repository.findById(chartId);
			if (!existingChart) {
				return {
					success: false,
					error: `Chart with ID ${chartId} not found`,
				};
			}

			// Destroy renderer
			await renderer.destroy();

			// Delete from repository
			await repository.delete(chartId);

			// Emit destroy event
			eventHandler.emit("chart:destroyed", {
				chartId,
				timestamp: now,
			});

			return {
				success: true,
				chartId,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error during chart destruction",
			};
		}
	};

// Batch destroy use case
export const batchDestroyChartsUseCase =
	(renderer: IChartRenderer, repository: IChartRepository, eventHandler: IChartEventHandler) =>
	async (chartIds: readonly string[], now: number = Date.now()): Promise<ChartResponse> => {
		const results: { chartId: string; success: boolean; error?: string }[] = [];

		try {
			for (const chartId of chartIds) {
				const existingChart = await repository.findById(chartId);
				if (!existingChart) {
					results.push({
						chartId,
						success: false,
						error: "Chart not found",
					});
					continue;
				}

				try {
					await repository.delete(chartId);
					results.push({
						chartId,
						success: true,
					});
				} catch (error) {
					results.push({
						chartId,
						success: false,
						error: error instanceof Error ? error.message : "Failed to delete",
					});
				}
			}

			// Destroy renderer once for all charts
			await renderer.destroy();

			const successCount = results.filter((r) => r.success).length;
			const totalCount = results.length;

			// Emit batch destroy event
			eventHandler.emit("charts:batch-destroyed", {
				results,
				successCount,
				totalCount,
				timestamp: now,
			});

			return {
				success: successCount === totalCount,
				...(successCount !== totalCount && {
					error: `${totalCount - successCount} charts failed to destroy`,
				}),
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error during batch destroy",
			};
		}
	};
