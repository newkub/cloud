import type { GaugeChartComponentProps } from "./types";

export const defaultGaugeChartProps: Partial<GaugeChartComponentProps> = {
	width: 300,
	height: 200,
	padding: 40,
	arcWidth: 20,
	needleWidth: 3,
	showValue: true,
	thresholds: [],
};
