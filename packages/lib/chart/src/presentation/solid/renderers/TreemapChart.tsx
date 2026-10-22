import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderTreemapChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	// Labels available for future axis rendering
	// const labels = data.labels ?? [];
	const total = values.reduce((sum, val) => sum + val, 0);
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const colors = CHART_CONSTANTS.DEFAULT_COLORS;

	let currentX = padding;
	let currentY = padding;
	let currentRowHeight = 0;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Treemap Chart</title>
			<For each={values}>
				{(value, index) => {
					const i = index();
					const ratio = value / total;
					const rectWidth = ratio * chartWidth;
					const rectHeight = chartHeight / Math.ceil(Math.sqrt(values.length));

					if (currentX + rectWidth > padding + chartWidth) {
						currentX = padding;
						currentY += currentRowHeight;
						currentRowHeight = 0;
					}

					const x = currentX;
					const y = currentY;
					currentX += rectWidth;
					currentRowHeight = Math.max(currentRowHeight, rectHeight);

					return (
						<rect
							x={x}
							y={y}
							width={rectWidth - 2}
							height={rectHeight - 2}
							fill={colors[i % colors.length]}
							class="hover:opacity-80 transition-opacity"
						/>
					);
				}}
			</For>
		</svg>
	);
};
