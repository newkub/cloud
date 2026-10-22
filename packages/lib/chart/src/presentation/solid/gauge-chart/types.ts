import type { ChartPoint, GaugeThreshold } from "../../../modules/chart/types/index";

export interface GaugeValue {
	value?: number;
	min?: number;
	max?: number;
}

export interface GaugeChartComponentProps extends GaugeValue {
	width?: number;
	height?: number;
	padding?: number;
	arcWidth?: number;
	needleWidth?: number;
	showValue?: boolean;
	thresholds?: readonly GaugeThreshold[];
	onReady?: (canvas: HTMLCanvasElement) => void;
	onClick?: (event: MouseEvent, data: ChartPoint) => void;
	onHover?: (event: MouseEvent, data: ChartPoint | null) => void;
	onThreshold?: (threshold: GaugeThreshold) => void;
}
