// ============================================================================
// Chart State Management Composable - SolidJS
// ============================================================================

import { createSignal } from "solid-js";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export interface ChartState {
	chartId: () => string | null;
	data: () => ChartData;
	options: () => ChartOptions;
	loading: () => boolean;
	error: () => string | null;
	isInitialized: () => boolean;
}

export interface ChartStateMutators {
	setChartId: (id: string | null) => void;
	setData: (data: ChartData) => void;
	setOptions: (options: ChartOptions) => void;
	setLoading: (value: boolean) => void;
	setError: (value: string | null) => void;
	setInitialized: (value: boolean) => void;
	updateData: (updates: Partial<ChartData>) => void;
	updateOptions: (updates: Partial<ChartOptions>) => void;
}

export function useChartState(): ChartState & ChartStateMutators {
	const [chartId, setChartId] = createSignal<string | null>(null);
	const [data, setData] = createSignal<ChartData>({
		labels: [],
		datasets: [],
	});
	const [options, setOptions] = createSignal<ChartOptions>({});
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [isInitialized, setInitialized] = createSignal(false);

	const updateData = (updates: Partial<ChartData>) => {
		setData((prev) => ({ ...prev, ...updates }));
	};

	const updateOptions = (updates: Partial<ChartOptions>) => {
		setOptions((prev) => ({ ...prev, ...updates }));
	};

	return {
		// State (as accessors)
		chartId,
		data,
		options,
		loading,
		error,
		isInitialized,
		// Mutators
		setChartId,
		setData,
		setOptions,
		setLoading,
		setError,
		setInitialized,
		updateData,
		updateOptions,
	};
}
