// ============================================================================
// Chart Actions Composable - SolidJS
// Functional Programming - Composable for chart actions
// ============================================================================

import { createChartUseCase, destroyChartUseCase, updateChartUseCase } from "../../../modules/chart/application/index";
import type { ChartResponse, CreateChartRequest, UpdateChartRequest } from "../../../modules/chart/domain/index";
import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../../modules/chart/ports/index";
import { useChartState } from "./useChartState";

// ============================================================================
// Error Handling Utilities
// ============================================================================

const extractErrorMessage = (error: unknown): string => {
	return error instanceof Error ? error.message : "Unknown error occurred";
};

// ============================================================================
// Async Action Wrapper
// ============================================================================

interface AsyncActionOptions {
	onStart: () => void;
	onSuccess: () => void;
	onError: (message: string) => void;
	onFinally: () => void;
}

const executeAsyncAction = async <T>(action: () => Promise<T>, options: AsyncActionOptions): Promise<T> => {
	options.onStart();
	try {
		const result = await action();
		options.onSuccess();
		return result;
	} catch (error) {
		const message = extractErrorMessage(error);
		options.onError(message);
		throw error;
	} finally {
		options.onFinally();
	}
};

export interface ChartActions {
	createChart: (request: CreateChartRequest) => Promise<ChartResponse>;
	updateChart: (id: string, request: UpdateChartRequest) => Promise<ChartResponse>;
	destroyChart: (id: string) => Promise<ChartResponse>;
	refreshChart: (id: string) => Promise<void>;
}

export function useChartActions(
	repository: IChartRepository,
	renderer: IChartRenderer,
	eventHandler: IChartEventHandler,
): ChartActions {
	const state = useChartState();

	const createChart = async (request: CreateChartRequest): Promise<ChartResponse> => {
		return executeAsyncAction(
			async () => {
				const executeUseCase = createChartUseCase(renderer, repository, eventHandler);
				const response = await executeUseCase(request);

				if (response.success && response.chartId) {
					state.setChartId(response.chartId);
					state.setData(request.data);
					state.setInitialized(true);
				} else {
					state.setError(response.error || "Failed to create chart");
				}

				return response;
			},
			{
				onStart: () => {
					state.setLoading(true);
					state.setError(null);
				},
				onSuccess: () => {},
				onError: (message) => state.setError(message),
				onFinally: () => state.setLoading(false),
			},
		).catch((error) => ({
			success: false,
			error: extractErrorMessage(error),
		}));
	};

	const updateChart = async (id: string, request: UpdateChartRequest): Promise<ChartResponse> => {
		return executeAsyncAction(
			async () => {
				const executeUseCase = updateChartUseCase(renderer, repository, eventHandler);
				const response = await executeUseCase({ ...request, chartId: id });

				if (response.success) {
					state.updateData(request.data);
				} else {
					state.setError(response.error || "Failed to update chart");
				}

				return response;
			},
			{
				onStart: () => {
					state.setLoading(true);
					state.setError(null);
				},
				onSuccess: () => {},
				onError: (message) => state.setError(message),
				onFinally: () => state.setLoading(false),
			},
		).catch((error) => ({
			success: false,
			error: extractErrorMessage(error),
		}));
	};

	const destroyChart = async (id: string): Promise<ChartResponse> => {
		return executeAsyncAction(
			async () => {
				const executeUseCase = destroyChartUseCase(renderer, repository, eventHandler);
				const response = await executeUseCase(id);

				if (response.success) {
					state.setInitialized(false);
					state.setData({ labels: [], datasets: [] });
				} else {
					state.setError(response.error || "Failed to destroy chart");
				}

				return response;
			},
			{
				onStart: () => {
					state.setLoading(true);
					state.setError(null);
				},
				onSuccess: () => {},
				onError: (message) => state.setError(message),
				onFinally: () => state.setLoading(false),
			},
		).catch((error) => ({
			success: false,
			error: extractErrorMessage(error),
		}));
	};

	const refreshChart = async (id: string): Promise<void> => {
		await executeAsyncAction(
			async () => {
				const chart = await repository.findById(id);
				if (chart) {
					state.setData(chart.data);
					state.setOptions(chart.options);
					state.setInitialized(true);
				} else {
					state.setError("Chart not found");
				}
			},
			{
				onStart: () => {
					state.setLoading(true);
					state.setError(null);
				},
				onSuccess: () => {},
				onError: (message) => state.setError(message),
				onFinally: () => state.setLoading(false),
			},
		);
	};

	return {
		createChart,
		updateChart,
		destroyChart,
		refreshChart,
	};
}
