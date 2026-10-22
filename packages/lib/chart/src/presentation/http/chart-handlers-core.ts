// HTTP handlers for chart API - functional implementation

import { createChartUseCase, destroyChartUseCase, updateChartUseCase } from "../../modules/chart/application/index";
import type { ChartModel, IChartEventHandler, IChartRenderer, IChartRepository } from "../../modules/chart/ports/index";
import type { ChartResponse, CreateChartRequest, UpdateChartRequest } from "../../modules/chart/types/index";

// HTTP handler factory
export const createChartHandlers = (
	repository: IChartRepository,
	renderer: IChartRenderer,
	eventHandler: IChartEventHandler,
) => ({
	// POST /api/charts - Create chart
	createChart: async (request: CreateChartRequest): Promise<ChartResponse> => {
		const useCase = createChartUseCase(renderer, repository, eventHandler);
		return await useCase(request);
	},

	// GET /api/charts/:id - Get chart by ID
	getChart: async (id: string): Promise<ChartResponse> => {
		try {
			const chart = await repository.findById(id);
			if (!chart) {
				return {
					success: false,
					error: `Chart with ID ${id} not found`,
				};
			}

			return {
				success: true,
				chartId: id,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	},

	// GET /api/charts - Get all charts
	getAllCharts: async (): Promise<{
		success: boolean;
		charts?: readonly ChartModel[];
		error?: string;
	}> => {
		try {
			const charts = await repository.findAll();
			return {
				success: true,
				charts: [...charts],
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	},

	// PUT /api/charts/:id - Update chart
	updateChart: async (id: string, request: UpdateChartRequest): Promise<ChartResponse> => {
		const useCase = updateChartUseCase(renderer, repository, eventHandler);

		// Ensure data is provided for domain layer
		const updateData = request.data ?? {
			labels: [],
			datasets: [],
		};

		return await useCase({ ...request, chartId: id, data: updateData });
	},

	// DELETE /api/charts/:id - Delete chart
	deleteChart: async (id: string): Promise<ChartResponse> => {
		const useCase = destroyChartUseCase(renderer, repository, eventHandler);
		return await useCase(id);
	},
});
