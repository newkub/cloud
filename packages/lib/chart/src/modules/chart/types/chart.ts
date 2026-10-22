// Chart domain types (readonly, immutable)

// Core data structures
export interface ChartData {
	readonly labels: readonly string[];
	readonly datasets: readonly ChartDataset[];
}

export interface ChartDataset {
	readonly label: string;
	readonly data: readonly number[];
	readonly color?: string;
	readonly backgroundColor?: string;
	readonly borderColor?: string;
}

export interface ChartOptions {
	readonly responsive?: boolean;
	readonly maintainAspectRatio?: boolean;
	readonly animation?: boolean;
	readonly legend?: boolean;
	readonly tooltip?: boolean;
	readonly title?: string;
	readonly theme?: string;
	readonly renderer?: "canvas" | "svg";
	readonly smooth?: boolean;
	readonly area?: boolean;
}

export interface ChartConfig {
	readonly type: ChartType;
	readonly data: ChartData;
	readonly options?: ChartOptions;
}

// Chart types
export type ChartType =
	| "line"
	| "bar"
	| "pie"
	| "gauge"
	| "geographic"
	| "scatter"
	| "heatmap"
	| "radar"
	| "funnel"
	| "sankey"
	| "treemap"
	| "area"
	| "boxplot"
	| "candlestick"
	| "histogram"
	| "polar-area"
	| "rose"
	| "streamgraph"
	| "step-line"
	| "spline"
	| "stacked-bar"
	| "stacked-area"
	| "multi-axis"
	| "timeline"
	| "gantt"
	| "word-cloud"
	| "network"
	| "chord";

// Value objects for specific chart types
export interface GaugeValue {
	readonly value: number;
	readonly min: number;
	readonly max: number;
}

export interface GaugeThreshold {
	readonly value: number;
	readonly color: string;
	readonly label?: string;
}

export interface ChartPoint {
	readonly x: number;
	readonly y: number;
}

// Rendering coordinates
export interface RenderPoint extends ChartPoint {
	readonly radius?: number;
	readonly angle?: number;
}

export interface ChartBounds {
	readonly minX: number;
	readonly minY: number;
	readonly maxX: number;
	readonly maxY: number;
}

// Animation states
export interface AnimationState {
	readonly progress: number;
	readonly duration: number;
	readonly easing: (t: number) => number;
	readonly startTime: number;
}

// Domain events
export interface ChartEvent {
	readonly type: string;
	readonly timestamp: number;
	readonly data: unknown;
}

export interface ChartRenderEvent extends ChartEvent {
	readonly type: "render";
	readonly data: { chartId: string; timestamp: number };
}

export interface ChartClickEvent extends ChartEvent {
	readonly type: "click";
	readonly data: ChartPoint;
}

export interface ChartUpdateEvent extends ChartEvent {
	readonly type: "update";
	readonly data: { chartId: string; newData: ChartData };
}

// Additional event types for chart lifecycle
export interface ChartCreateEvent extends ChartEvent {
	readonly type: "create";
	readonly data: { chartId: string; chartType: string };
}

export interface ChartDestroyEvent extends ChartEvent {
	readonly type: "destroy";
	readonly data: { chartId: string };
}

export interface ChartResizeEvent extends ChartEvent {
	readonly type: "resize";
	readonly data: { chartId: string; width: number; height: number };
}

export interface ChartDataChangeEvent extends ChartEvent {
	readonly type: "dataChange";
	readonly data: { chartId: string; oldData: ChartData; newData: ChartData };
}

export interface ChartAnimationEvent extends ChartEvent {
	readonly type: "animation";
	readonly data: { chartId: string; progress: number; duration: number };
}

// Request/Response types for application layer
export interface CreateChartRequest {
	readonly type: ChartType;
	readonly data: ChartData;
	readonly options?: ChartOptions;
}

export interface UpdateChartRequest {
	readonly chartId: string;
	readonly data: ChartData;
}

export interface ChartResponse {
	readonly success: boolean;
	readonly chartId?: string;
	readonly error?: string;
}

// Validation types
export interface ValidationResult {
	readonly isValid: boolean;
	readonly errors: readonly string[];
}

// Chart metadata
export interface ChartMetadata {
	readonly id: string;
	readonly type: ChartType;
	readonly createdAt: number;
	readonly updatedAt: number;
	readonly version: string;
}

// Callback types for chart components
export interface ChartCallbacks {
	readonly onReady?: (chart: ChartInstance) => void;
	readonly onClick?: (params: ChartClickParams) => void;
	readonly onError?: (error: ChartError | string) => void;
}

export interface ChartInstance {
	readonly type: ChartType;
	readonly id: string;
}

export interface ChartClickParams {
	readonly point: ChartPoint;
	readonly datasetIndex?: number;
	readonly dataIndex?: number;
}

export interface ChartError {
	readonly message: string;
	readonly code?: string;
	readonly details?: unknown;
}

// Allow string for backward compatibility with existing code
export type ChartErrorHandler = (error: ChartError | string) => void;
