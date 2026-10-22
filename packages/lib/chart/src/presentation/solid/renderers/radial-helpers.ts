import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData } from "../../../modules/chart/types/index";

const colors = CHART_CONSTANTS.DEFAULT_COLORS;
export const PICK = (i: number) => colors[i % colors.length];

export const firstValues = (data: ChartData) => data.datasets?.[0]?.data ?? [];
export const labelsOf = (data: ChartData) => data.labels ?? [];
