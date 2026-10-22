/**
 * Presentation layer types for chart module
 * Clean Architecture: Presentation layer - Type definitions
 */

import type { ChartModel } from "../modules/chart/ports/index";
import type { ChartData, ChartType } from "../modules/chart/types/index";

export interface CreateChartRequest {
	readonly type: ChartType;
	readonly data: ChartData;
	readonly options?: Record<string, unknown>;
}

export interface UpdateChartRequest {
	readonly data?: ChartData;
	readonly options?: Record<string, unknown>;
}

export interface ChartResponse {
	readonly success: boolean;
	readonly chartId?: string;
	readonly chart?: ChartModel;
	readonly error?: string;
}
