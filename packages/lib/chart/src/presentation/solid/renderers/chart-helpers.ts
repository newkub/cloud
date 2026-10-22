import { CHART_CONSTANTS } from "../../../shared/constants/index";

export const chartColors = CHART_CONSTANTS.DEFAULT_COLORS;
export const PICK = (i: number) => chartColors[i % chartColors.length];
export const PAD = CHART_CONSTANTS.DEFAULT_PADDING;

export const sorted = (a: readonly number[]) => [...a].sort((x, y) => x - y);
export const quartile = (s: readonly number[], p: number) => s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? 0;
