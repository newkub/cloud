import { createEffect, createSignal, onCleanup, onMount, splitProps } from "solid-js";
import { createCanvasRenderer } from "../../../adapters/external/renderers/index";
import { drawGaugeChart } from "./drawing";
import { createMouseHandlers } from "./events";
import type { GaugeChartComponentProps } from "./types";

export function GaugeChart(props: GaugeChartComponentProps) {
	const [local] = splitProps(props, [
		"thresholds",
		"padding",
		"arcWidth",
		"needleWidth",
		"showValue",
		"width",
		"height",
		"onReady",
		"onClick",
		"onHover",
		"onThreshold",
	]);

	let containerRef: HTMLDivElement | undefined;
	let canvasRef: HTMLCanvasElement | undefined;
	const [isReady, setIsReady] = createSignal(false);
	const [isRendering, setIsRendering] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [chartWidth, _setChartWidth] = createSignal(local.width ?? 400);
	const [chartHeight, _setChartHeight] = createSignal(local.height ?? 300);

	let renderer: ReturnType<typeof createCanvasRenderer> | null = null;

	const initChart = async () => {
		if (!canvasRef) return;

		setIsRendering(true);
		setError(null);

		try {
			renderer = createCanvasRenderer(canvasRef);

			// Draw gauge
			await drawGaugeChart(renderer, canvasRef, props, chartWidth(), chartHeight());

			setIsReady(true);
			local.onReady?.(canvasRef);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setIsRendering(false);
		}
	};

	const { handleMouseMove, handleClick } = createMouseHandlers(canvasRef, isReady, chartWidth, chartHeight, props);

	onMount(() => {
		initChart();
	});

	onCleanup(() => {
		if (renderer) {
			renderer.destroy();
		}
	});

	createEffect(() => {
		if (isReady() && canvasRef && renderer) {
			drawGaugeChart(renderer, canvasRef, props, chartWidth(), chartHeight());
		}
	});

	return (
		<div ref={containerRef} class="gauge-chart">
			<canvas
				ref={canvasRef}
				width={chartWidth()}
				height={chartHeight()}
				onMouseMove={handleMouseMove}
				onClick={handleClick}
			/>
			{error() && <div class="error">{error()}</div>}
			{isRendering() && <div class="loading">Rendering...</div>}
		</div>
	);
}
