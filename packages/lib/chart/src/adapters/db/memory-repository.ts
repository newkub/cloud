// In-memory repository adapter - functional implementation

import type { ChartModel, IChartRepository } from "../../modules/chart/ports/index";
import { InfrastructureError } from "../../shared/errors/index";
import type { ChartResponse } from "../../modules/chart/types/index";

// Memory repository factory
export const createMemoryRepository = (initialCharts?: readonly ChartModel[]): IChartRepository => {
	const charts = new Map<string, ChartModel>();
	for (const chart of initialCharts ?? []) {
		charts.set(chart.id, chart);
	}

	return {
		save: async (chart: ChartModel): Promise<ChartResponse> => {
			try {
				charts.set(chart.id, chart);
				return { success: true, chartId: chart.id };
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : "Failed to save chart",
				};
			}
		},

		findById: async (id: string): Promise<ChartModel | null> => {
			try {
				return charts.get(id) || null;
			} catch (error) {
				throw InfrastructureError(`Failed to find chart: ${error}`, "repository");
			}
		},

		findAll: async (): Promise<readonly ChartModel[]> => {
			try {
				return Array.from(charts.values());
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				throw InfrastructureError(`Failed to find all charts: ${errorMessage}`, "repository");
			}
		},

		delete: async (id: string): Promise<void> => {
			try {
				charts.delete(id);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				throw InfrastructureError(`Failed to delete chart: ${errorMessage}`, "repository");
			}
		},

		update: async (id: string, updates: Partial<ChartModel>): Promise<ChartResponse> => {
			try {
				const existingChart = charts.get(id);
				if (!existingChart) {
					return {
						success: false,
						error: `Chart with ID ${id} not found`,
					};
				}

				const updatedChart: ChartModel = {
					...existingChart,
					...updates,
					metadata: {
						...existingChart.metadata,
						...updates.metadata,
						updatedAt: updates.metadata?.updatedAt ?? existingChart.metadata.updatedAt,
					},
				};

				charts.set(id, updatedChart);
				return { success: true, chartId: id };
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : "Failed to update chart",
				};
			}
		},
	};
};

// Repository with persistence simulation
export const createPersistedMemoryRepository = (): IChartRepository => {
	const persistKey = "chart-repository-data";

	const loadFromStorage = (): readonly ChartModel[] => {
		try {
			const stored = localStorage.getItem(persistKey);
			if (stored) {
				return JSON.parse(stored) as ChartModel[];
			}
		} catch (_error) {
			// Silent fail - storage is optional
		}
		return [];
	};

	const memoryRepo = createMemoryRepository(loadFromStorage());

	const saveToStorage = async (): Promise<void> => {
		try {
			const charts = await memoryRepo.findAll();
			localStorage.setItem(persistKey, JSON.stringify(charts));
		} catch (_error) {
			// Silent fail - storage is optional
		}
	};

	return {
		...memoryRepo,
		save: async (chart: ChartModel): Promise<ChartResponse> => {
			const result = await memoryRepo.save(chart);
			if (result.success) {
				await saveToStorage();
			}
			return result;
		},

		delete: async (id: string): Promise<void> => {
			await memoryRepo.delete(id);
			await saveToStorage();
		},

		update: async (id: string, updates: Partial<ChartModel>): Promise<ChartResponse> => {
			const result = await memoryRepo.update(id, updates);
			if (result.success) {
				await saveToStorage();
			}
			return result;
		},
	};
};
