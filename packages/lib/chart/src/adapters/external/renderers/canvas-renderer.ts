/**
 * Canvas Renderer - Infrastructure Layer
 * Renders charts using HTML5 Canvas API (Functional Implementation)
 */

import type { IChartRenderer } from "../../../modules/chart/ports/index";
import type { ChartData } from "../../../modules/chart/types/index";
import { clearCanvas, drawSvgPath } from "./canvas-renderer-utils";
import { renderBarChart } from "./render-bar-chart";
import { renderGaugeChart } from "./render-gauge-chart";
import { renderLineChart } from "./render-line-chart";
import { renderPieChart } from "./render-pie-chart";

// Local type definition since ChartConfig is not exported
interface ChartConfig {
	readonly type: "line" | "bar" | "pie" | "gauge" | "geographic";
	readonly data: ChartData;
}

// Geographic chart rendering
const renderGeographicChart = (
	config: ChartConfig,
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
): { success: boolean; error?: string } => {
	const { width, height } = canvas;
	const data = config.data as {
		regions?: Array<{ name: string; value: number; path?: string }>;
	};

	if (!data.regions || data.regions.length === 0) {
		return {
			success: false,
			error: "No region data provided for geographic chart",
		};
	}

	// Clear canvas
	ctx.clearRect(0, 0, width, height);

	// Calculate color scale based on values
	const values = data.regions.map((r) => r.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);
	const valueRange = maxValue - minValue || 1;

	// Color interpolation function (light blue to dark blue)
	const getColorForValue = (value: number): string => {
		const normalized = (value - minValue) / valueRange;
		const lightness = 90 - normalized * 50; // 90% to 40% lightness
		return `hsl(210, 70%, ${lightness}%)`;
	};

	// Draw regions
	data.regions.forEach((region, index) => {
		ctx.fillStyle = getColorForValue(region.value);
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 1;

		if (region.path) {
			const x = (index % 4) * (width / 4);
			const y = Math.floor(index / 4) * (height / 4);
			drawSvgPath(ctx, region.path, x, y, width / 4, height / 4);
		}

		// Add label
		const x = (index % 4) * (width / 4);
		const y = Math.floor(index / 4) * (height / 4);
		ctx.fillStyle = "#000000";
		ctx.font = "12px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(region.name, x + width / 8, y + height / 8);
	});

	return { success: true };
};

// Canvas renderer state (immutable)
interface CanvasRendererState {
	readonly canvas: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	readonly currentConfig: ChartConfig | null;
}

// Canvas renderer factory
export const createCanvasRenderer = (canvas: HTMLCanvasElement): IChartRenderer => {
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get 2D context from canvas");
	}

	// Encapsulated state
	let state: CanvasRendererState = {
		canvas,
		ctx,
		currentConfig: null,
	};

	return {
		render: async (config: ChartConfig): Promise<{ success: boolean; error?: string }> => {
			const { width, height } = state.canvas;

			// Clear canvas
			clearCanvas(state.ctx, width, height);

			// Update state
			state = { ...state, currentConfig: config };

			// Render based on chart type
			switch (config.type) {
				case "line":
					return renderLineChart(state.ctx, state.canvas, config);
				case "bar":
					return renderBarChart(state.ctx, state.canvas, config);
				case "pie":
					return renderPieChart(state.ctx, state.canvas, config);
				case "gauge":
					return renderGaugeChart(state.ctx, state.canvas, config);
				case "geographic":
					return renderGeographicChart(config, state.ctx, state.canvas);
				default:
					return {
						success: false,
						error: `Unsupported chart type: ${config.type}`,
					};
			}
		},

		update: async (data: ChartData): Promise<{ success: boolean; error?: string }> => {
			if (!state.currentConfig) {
				return { success: false, error: "No chart configured" };
			}

			const updatedConfig = { ...state.currentConfig, data };
			state = { ...state, currentConfig: updatedConfig };
			const { width, height } = state.canvas;
			clearCanvas(state.ctx, width, height);

			// Render based on chart type
			switch (updatedConfig.type) {
				case "line":
					return renderLineChart(state.ctx, state.canvas, updatedConfig);
				case "bar":
					return renderBarChart(state.ctx, state.canvas, updatedConfig);
				case "pie":
					return renderPieChart(state.ctx, state.canvas, updatedConfig);
				case "gauge":
					return renderGaugeChart(state.ctx, state.canvas, updatedConfig);
				case "geographic":
					return renderGeographicChart(updatedConfig, state.ctx, state.canvas);
				default:
					return {
						success: false,
						error: `Unsupported chart type: ${updatedConfig.type}`,
					};
			}
		},

		destroy: async (): Promise<void> => {
			clearCanvas(state.ctx, state.canvas.width, state.canvas.height);
			state = {
				canvas: state.canvas,
				ctx: state.ctx,
				currentConfig: null,
			};
		},

		resize: async (width: number, height: number): Promise<void> => {
			state.canvas.width = width;
			state.canvas.height = height;
		},
	};
};
