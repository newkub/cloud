// ============================================================================
// SolidJS Chart Composable - Clean Architecture Adapter
// ============================================================================

import type { IChartEventHandler, IChartRenderer, IChartRepository } from "../../../modules/chart/ports/index";
import type { ChartData, ChartOptions, ChartType } from "../../../modules/chart/types/index";
import { useChartActions } from "./useChartActions";
import { useChartState } from "./useChartState";

export interface UseChartReturn {
	// State
	chartId: () => string | null;
	data: () => ChartData;
	options: () => ChartOptions;
	loading: () => boolean;
	error: () => string | null;
	isInitialized: () => boolean;

	// Actions
	createChart: (type: ChartType, data: ChartData, options?: ChartOptions) => Promise<void>;
	updateChart: (data: ChartData) => Promise<void>;
	destroyChart: () => Promise<void>;
	refreshChart: () => Promise<void>;

	// Mutators
	setData: (data: ChartData) => void;
	setOptions: (options: ChartOptions) => void;
	updateData: (updates: Partial<ChartData>) => void;
	updateOptions: (updates: Partial<ChartOptions>) => void;
}

/**
 * Main chart composable - composed from smaller, focused composables
 * @param repository - Chart repository instance
 * @param renderer - Chart renderer instance
 * @param eventHandler - Chart event handler instance
 * @returns UseChartReturn
 */
export const useChart = (
	repository: IChartRepository,
	renderer: IChartRenderer,
	eventHandler: IChartEventHandler,
): UseChartReturn => {
	const state = useChartState();
	const actions = useChartActions(repository, renderer, eventHandler);

	const createChart = async (type: ChartType, data: ChartData, options?: ChartOptions) => {
		const response = await actions.createChart({
			type,
			data,
			options: options || {},
		});

		if (!response.success) {
			throw new Error(response.error || "Failed to create chart");
		}
	};

	const updateChart = async (data: ChartData) => {
		const currentChartId = state.chartId();
		if (!currentChartId) {
			throw new Error("Chart is not initialized");
		}

		const response = await actions.updateChart(currentChartId, {
			chartId: currentChartId,
			data,
		});

		if (!response.success) {
			throw new Error(response.error || "Failed to update chart");
		}
	};

	const destroyChart = async () => {
		const currentChartId = state.chartId();
		if (!currentChartId) {
			return;
		}

		const response = await actions.destroyChart(currentChartId);

		if (!response.success) {
			throw new Error(response.error || "Failed to destroy chart");
		}
	};

	const refreshChart = async () => {
		const currentChartId = state.chartId();
		if (!currentChartId) {
			return;
		}

		await actions.refreshChart(currentChartId);
	};

	return {
		// State
		chartId: state.chartId,
		data: state.data,
		options: state.options,
		loading: state.loading,
		error: state.error,
		isInitialized: state.isInitialized,

		// Actions
		createChart,
		updateChart,
		destroyChart,
		refreshChart,

		// Mutators
		setData: state.setData,
		setOptions: state.setOptions,
		updateData: state.updateData,
		updateOptions: state.updateOptions,
	};
};
