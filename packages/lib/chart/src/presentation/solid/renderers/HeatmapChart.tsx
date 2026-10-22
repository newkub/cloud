import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderHeatmapChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	// Labels available for future axis rendering
	// const labels = data.labels ?? [];
	const maxValue = Math.max(...values, 0);
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const gridSize = Math.ceil(Math.sqrt(values.length));
	const cellWidth = chartWidth / gridSize;
	const cellHeight = chartHeight / gridSize;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Heatmap Chart</title>
			<For each={values}>
				{(value, index) => {
					const i = index();
					const row = Math.floor(i / gridSize);
					const col = i % gridSize;
					const x = padding + col * cellWidth;
					const y = padding + row * cellHeight;
					const intensity = value / maxValue;
					const color = `rgba(59, 130, 246, ${intensity})`;
					return (
						<rect
							x={x}
							y={y}
							width={cellWidth - 2}
							height={cellHeight - 2}
							fill={color}
							class="hover:opacity-80 transition-opacity"
						/>
					);
				}}
			</For>
		</svg>
	);
};
