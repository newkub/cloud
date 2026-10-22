import type { createCanvasRenderer } from "../../../adapters/external/renderers/index";
import { drawArc, drawNeedle } from "./draw-primitives";
import type { GaugeChartComponentProps } from "./types";
import { calculateAngle, calculateGaugePercentage, getGaugeThreshold } from "./utils";

export function drawGaugeChart(
	renderer: ReturnType<typeof createCanvasRenderer> | null,
	canvas: HTMLCanvasElement,
	props: GaugeChartComponentProps,
	chartWidth: number,
	chartHeight: number,
) {
	if (!renderer || !canvas) return;

	const value = props.value ?? 0;
	const min = props.min ?? 0;
	const max = props.max ?? 100;
	const thresholds = props.thresholds ?? [];

	// Calculate gauge dimensions
	const width = chartWidth ?? 0;
	const height = chartHeight ?? 0;
	const centerX = width / 2;
	const centerY = height / 2;
	const radius = Math.min(centerX, centerY) - (props.padding ?? 40);
	const arcWidth = props.arcWidth ?? 20;

	// Get canvas context
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not get canvas context");

	// Clear canvas
	ctx.clearRect(0, 0, width, height);

	// Draw background arc
	drawArc(ctx, centerX, centerY, radius, -Math.PI, Math.PI, "#e5e7eb", arcWidth);

	// Draw threshold arcs
	let startAngle = -Math.PI;
	for (const threshold of thresholds) {
		const thresholdPercentage = calculateGaugePercentage(threshold.value, min, max);
		const endAngle = calculateAngle(thresholdPercentage, -Math.PI, Math.PI);

		drawArc(ctx, centerX, centerY, radius, startAngle, endAngle, threshold.color, arcWidth);
		startAngle = endAngle;
	}

	// Draw needle
	const valuePercentage = calculateGaugePercentage(value, min, max);
	const needleAngle = calculateAngle(valuePercentage, -Math.PI, Math.PI);
	drawNeedle(ctx, centerX, centerY, radius * 0.8, needleAngle, props.needleWidth ?? 3);

	// Draw value text
	if (props.showValue !== false) {
		ctx.fillStyle = "#374151";
		ctx.font = "bold 24px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(value.toString(), centerX, centerY + radius * 0.4);
	}

	// Check threshold
	const currentThreshold = getGaugeThreshold(value, thresholds);
	if (currentThreshold) {
		props.onThreshold?.(currentThreshold);
	}
}
