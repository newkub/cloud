export type ChartType = "bar" | "line" | "area" | "scatter" | "pie" | "donut" | "radar" | "gauge";

export interface ChartDataPoint {
	label: string;
	value: number;
	color?: string;
}

export type ChartVariant = "default" | "primary" | "success" | "warning" | "destructive" | "info";
