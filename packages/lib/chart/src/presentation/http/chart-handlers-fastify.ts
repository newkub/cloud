// Fastify style handler wrapper

import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../modules/chart/ports/index";
import type { CreateChartRequest, UpdateChartRequest } from "../../modules/chart/types/index";
import { createChartHandlers } from "./chart-handlers-core";

export const createFastifyHandlers = (
	repository: IChartRepository,
	renderer: IChartRenderer,
	eventHandler: IChartEventHandler,
) => {
	const handlers = createChartHandlers(repository, renderer, eventHandler);

	return {
		// POST /api/charts
		postChart: async (
			request: { body: unknown },
			reply: {
				send: (data: unknown) => void;
				code: (code: number) => { send: (data: unknown) => void };
			},
		): Promise<void> => {
			try {
				const createRequest = request.body as CreateChartRequest;
				const result = await handlers.createChart(createRequest);

				if (result.success) {
					reply.code(201).send(result);
				} else {
					reply.code(400).send(result);
				}
			} catch (error) {
				reply.code(500).send({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// GET /api/charts/:id
		getChart: async (
			request: { params: { id: string } },
			reply: {
				send: (data: unknown) => void;
				code: (code: number) => { send: (data: unknown) => void };
			},
		): Promise<void> => {
			try {
				const result = await handlers.getChart(request.params.id);

				if (result.success) {
					reply.send(result);
				} else {
					reply.code(404).send(result);
				}
			} catch (error) {
				reply.code(500).send({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// GET /api/charts
		getAllCharts: async (
			_request: unknown,
			reply: {
				send: (data: unknown) => void;
				code: (code: number) => { send: (data: unknown) => void };
			},
		): Promise<void> => {
			try {
				const result = await handlers.getAllCharts();

				if (result.success) {
					reply.send(result);
				} else {
					reply.code(500).send(result);
				}
			} catch (error) {
				reply.code(500).send({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// PUT /api/charts/:id
		putChart: async (
			request: { params: { id: string }; body: unknown },
			reply: {
				send: (data: unknown) => void;
				code: (code: number) => { send: (data: unknown) => void };
			},
		): Promise<void> => {
			try {
				const updateRequest = request.body as UpdateChartRequest;
				const result = await handlers.updateChart(request.params.id, updateRequest);

				if (result.success) {
					reply.send(result);
				} else {
					reply.code(400).send(result);
				}
			} catch (error) {
				reply.code(500).send({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},

		// DELETE /api/charts/:id
		deleteChart: async (
			request: { params: { id: string } },
			reply: {
				send: (data: unknown) => void;
				code: (code: number) => { send: (data: unknown) => void };
			},
		): Promise<void> => {
			try {
				const result = await handlers.deleteChart(request.params.id);

				if (result.success) {
					reply.send(result);
				} else {
					reply.code(404).send(result);
				}
			} catch (error) {
				reply.code(500).send({
					success: false,
					error: error instanceof Error ? error.message : "Internal server error",
				});
			}
		},
	};
};
