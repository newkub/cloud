// Create chart use case - functional implementation

import type { ChartResponse, CreateChartRequest } from "../../types/index";
import { createChart } from "../../domain/models/chart";
import { validateChartConfig } from "../../domain/validators/chart-validators";
import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../ports/chart-ports";

// Pure function for creating a chart
export const createChartUseCase =
	(renderer: IChartRenderer, repository: IChartRepository, eventHandler: IChartEventHandler) =>
	async (request: CreateChartRequest, now: number = Date.now()): Promise<ChartResponse> => {
		try {
			// Validate the request
			const validation = validateChartConfig(request);
			if (!validation.isValid) {
				return {
					success: false,
					error: `Invalid chart configuration: ${validation.errors.join(", ")}`,
				};
			}

			// Create chart model
			const chartModel = createChart(request);

			// Save to repository
			const saveResult = await repository.save(chartModel);
			if (!saveResult.success) {
				return {
					success: false,
					error: "Failed to save chart",
				};
			}

			// Render the chart
			const renderResult = await renderer.render(request);
			if (!renderResult.success) {
				// If rendering fails, we might want to rollback the repository save
				await repository.delete(chartModel.id);
				return {
					success: false,
					error: "Failed to render chart",
				};
			}

			// Emit success event
			eventHandler.emit("chart:created", {
				chartId: chartModel.id,
				chartType: request.type,
				timestamp: now,
			});

			return {
				success: true,
				chartId: chartModel.id,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error during chart creation",
			};
		}
	};

// Alternative implementation with functional composition
export const createChartUseCaseFunctional =
	(renderer: IChartRenderer, repository: IChartRepository, eventHandler: IChartEventHandler) =>
	async (request: CreateChartRequest, now: number = Date.now()): Promise<ChartResponse> => {
		// Validate request
		const validation = validateChartConfig(request);
		if (!validation.isValid) {
			return {
				success: false,
				error: "Invalid chart configuration",
			};
		}

		try {
			// Create chart model
			const chartModel = createChart(request);

			// Save to repository
			const saveResult = await repository.save(chartModel);
			if (!saveResult.success) {
				throw new Error("Failed to save chart");
			}

			// Render chart
			const renderResult = await renderer.render(request);
			if (!renderResult.success) {
				throw new Error("Failed to render chart");
			}

			// Emit event
			eventHandler.emit("chart:created", {
				chartId: chartModel.id,
				chartType: request.type,
				timestamp: now,
			});

			return {
				success: true,
				chartId: chartModel.id,
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	};
