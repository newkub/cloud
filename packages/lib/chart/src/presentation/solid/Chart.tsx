import { createSignal, mergeProps, onCleanup, onMount, splitProps } from "solid-js";
import { CHART_CONSTANTS } from "../../shared/constants/index";
import type { ChartCallbacks, ChartData, ChartInstance, ChartOptions, ChartType } from "../../modules/chart/types/index";
import {
	renderAreaChart,
	renderBarChart,
	renderBoxplotChart,
	renderCandlestickChart,
	renderChordChart,
	renderFunnelChart,
	renderGanttChart,
	renderGaugeChart,
	renderGeographicChart,
	renderHeatmapChart,
	renderHistogramChart,
	renderLineChart,
	renderMultiAxisChart,
	renderNetworkChart,
	renderPieChart,
	renderPolarAreaChart,
	renderRadarChart,
	renderRoseChart,
	renderSankeyChart,
	renderScatterChart,
	renderSplineChart,
	renderStackedAreaChart,
	renderStackedBarChart,
	renderStepLineChart,
	renderStreamgraphChart,
	renderTimelineChart,
	renderTreemapChart,
	renderWordCloudChart,
} from "./renderers";

interface ChartProps extends ChartCallbacks {
	data: ChartData;
	type?: ChartType;
	options?: ChartOptions;
	width?: number;
	height?: number;
	className?: string;
	interactive?: boolean;
	responsive?: boolean;
}

const defaultChartProps: Partial<ChartProps> = {
	type: "line",
	options: {},
	width: CHART_CONSTANTS.DEFAULT_WIDTH,
	height: CHART_CONSTANTS.DEFAULT_HEIGHT,
	className: "",
	interactive: true,
	responsive: true,
};

export function Chart(props: ChartProps) {
	const [local] = splitProps(mergeProps(defaultChartProps, props), [
		"data",
		"type",
		"options",
		"width",
		"height",
		"className",
		"interactive",
		"responsive",
		"onReady",
		"onClick",
		"onError",
	]);

	const [containerRef, setContainerRef] = createSignal<HTMLDivElement | null>(null);
	const [chartSize, setChartSize] = createSignal({
		width: local.width ?? CHART_CONSTANTS.DEFAULT_WIDTH,
		height: local.height ?? CHART_CONSTANTS.DEFAULT_HEIGHT,
	});

	const chartWidth = () => chartSize().width;
	const chartHeight = () => chartSize().height;

	const renderChart = () => {
		const chartType = local.type ?? "line";

		switch (chartType) {
			case "line":
				return renderLineChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "bar":
				return renderBarChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "pie":
				return renderPieChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "scatter":
				return renderScatterChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "heatmap":
				return renderHeatmapChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "radar":
				return renderRadarChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "funnel":
				return renderFunnelChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "sankey":
				return renderSankeyChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "treemap":
				return renderTreemapChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "area":
				return renderAreaChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "spline":
				return renderSplineChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "stacked-bar":
				return renderStackedBarChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "gauge":
				return renderGaugeChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "geographic":
				return renderGeographicChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "boxplot":
				return renderBoxplotChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "candlestick":
				return renderCandlestickChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "histogram":
				return renderHistogramChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "polar-area":
				return renderPolarAreaChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "rose":
				return renderRoseChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "streamgraph":
				return renderStreamgraphChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "step-line":
				return renderStepLineChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "stacked-area":
				return renderStackedAreaChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "multi-axis":
				return renderMultiAxisChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "timeline":
				return renderTimelineChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "gantt":
				return renderGanttChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "word-cloud":
				return renderWordCloudChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "network":
				return renderNetworkChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			case "chord":
				return renderChordChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
			default:
				return renderLineChart(local.data, local.options ?? {}, chartWidth(), chartHeight());
		}
	};

	onMount(() => {
		const chartInstance: ChartInstance = {
			type: local.type ?? "line",
			id: `chart-${Date.now()}`,
		};
		local.onReady?.(chartInstance);

		// Responsive chart with ResizeObserver
		if (local.responsive && containerRef()) {
			const resizeObserver = new ResizeObserver((entries) => {
				const entry = entries[0];
				if (entry) {
					const { width, height } = entry.contentRect;
					setChartSize({
						width: width || (local.width ?? CHART_CONSTANTS.DEFAULT_WIDTH),
						height: height || (local.height ?? CHART_CONSTANTS.DEFAULT_HEIGHT),
					});
				}
			});

			const container = containerRef();
			if (container) {
				resizeObserver.observe(container);
			}

			onCleanup(() => {
				resizeObserver.disconnect();
			});
		}
	});

	return (
		<div
			ref={setContainerRef}
			class={`chart-container ${local.className} ${local.interactive ? "chart-hover chart-active" : ""}`}
			// overflow:hidden keeps the initial pre-measure SVG from stretching the layout
			style={local.responsive ? { width: "100%", height: "100%", overflow: "hidden", "min-width": "0" } : {}}
		>
			{renderChart()}
		</div>
	);
}
