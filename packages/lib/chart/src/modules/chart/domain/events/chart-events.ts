// Chart domain event types
import type { ChartClickEvent, ChartData, ChartEvent, ChartRenderEvent, ChartUpdateEvent } from "../../types/index";

// Event factory functions
export const createChartRenderEvent = (chartId: string, timestamp: number): ChartRenderEvent => ({
	type: "render",
	timestamp,
	data: { chartId, timestamp },
});

export const createChartClickEvent = (
	point: {
		x: number;
		y: number;
	},
	timestamp: number,
): ChartClickEvent => ({
	type: "click",
	timestamp,
	data: point,
});

export const createChartUpdateEvent = (chartId: string, newData: ChartData, timestamp: number): ChartUpdateEvent => ({
	type: "update",
	timestamp,
	data: { chartId, newData },
});

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

// Event factory functions for additional events
export const createChartCreateEvent = (chartId: string, chartType: string, timestamp: number): ChartCreateEvent => ({
	type: "create",
	timestamp,
	data: { chartId, chartType },
});

export const createChartDestroyEvent = (chartId: string, timestamp: number): ChartDestroyEvent => ({
	type: "destroy",
	timestamp,
	data: { chartId },
});

export const createChartResizeEvent = (
	chartId: string,
	width: number,
	height: number,
	timestamp: number,
): ChartResizeEvent => ({
	type: "resize",
	timestamp,
	data: { chartId, width, height },
});

export const createChartDataChangeEvent = (
	chartId: string,
	oldData: ChartData,
	newData: ChartData,
	timestamp: number,
): ChartDataChangeEvent => ({
	type: "dataChange",
	timestamp,
	data: { chartId, oldData, newData },
});

export const createChartAnimationEvent = (
	chartId: string,
	progress: number,
	duration: number,
	timestamp: number,
): ChartAnimationEvent => ({
	type: "animation",
	timestamp,
	data: { chartId, progress, duration },
});

// Event type union for all chart events
export type ChartDomainEvent =
	| ChartRenderEvent
	| ChartClickEvent
	| ChartUpdateEvent
	| ChartCreateEvent
	| ChartDestroyEvent
	| ChartResizeEvent
	| ChartDataChangeEvent
	| ChartAnimationEvent;

// Event type guards
export const isChartRenderEvent = (event: ChartDomainEvent): event is ChartRenderEvent => event.type === "render";

export const isChartClickEvent = (event: ChartDomainEvent): event is ChartClickEvent => event.type === "click";

export const isChartUpdateEvent = (event: ChartDomainEvent): event is ChartUpdateEvent => event.type === "update";

export const isChartCreateEvent = (event: ChartDomainEvent): event is ChartCreateEvent => event.type === "create";

export const isChartDestroyEvent = (event: ChartDomainEvent): event is ChartDestroyEvent => event.type === "destroy";

export const isChartResizeEvent = (event: ChartDomainEvent): event is ChartResizeEvent => event.type === "resize";

export const isChartDataChangeEvent = (event: ChartDomainEvent): event is ChartDataChangeEvent =>
	event.type === "dataChange";

export const isChartAnimationEvent = (event: ChartDomainEvent): event is ChartAnimationEvent =>
	event.type === "animation";
