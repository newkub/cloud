// Express.js style handler wrapper

import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../modules/chart/ports/index";
import type { CreateChartRequest, UpdateChartRequest } from "../../modules/chart/types/index";
import { createChartHandlers } from "./chart-handlers-core";

interface ExpressRequest {
	body: unknown;
	params: { id?: string };
}

interface ExpressResponse {
	status(code: number): ExpressResponse;
	json(data: unknown): void;
}

export const createExpressHandlers = (
	repository: IChartRepository,
	renderer: IChartRenderer,
	eventHandler: IChartEventHandler,
) => {
	const handlers = createChartHandlers(repository, renderer, eventHandler);

	return {
		// POST /api/charts
		postChart: async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
			try {
				const result = await handlers.createChart(req.body as CreateChartRequest);

				if (result.success) {
					res.status(201).json(result);
				} else {
					res.status(400).json(result);
				}
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// GET /api/charts/:id
		getChart: async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
			try {
				const result = await handlers.getChart(req.params.id ?? "");

				if (result.success) {
					res.json(result);
				} else {
					res.status(404).json(result);
				}
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// GET /api/charts
		getAllCharts: async (_req: ExpressRequest, res: ExpressResponse): Promise<void> => {
			try {
				const result = await handlers.getAllCharts();

				if (result.success) {
					res.json(result);
				} else {
					res.status(500).json(result);
				}
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// PUT /api/charts/:id
		putChart: async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
			try {
				const result = await handlers.updateChart(req.params.id ?? "", req.body as UpdateChartRequest);

				if (result.success) {
					res.json(result);
				} else {
					res.status(400).json(result);
				}
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// DELETE /api/charts/:id
		deleteChart: async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
			try {
				const result = await handlers.deleteChart(req.params.id ?? "");

				if (result.success) {
					res.json(result);
				} else {
					res.status(404).json(result);
				}
			} catch (error) {
				res.status(500).json({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},
	};
};
