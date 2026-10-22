import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderSankeyChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const labels = data.labels ?? [];
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const nodeWidth = chartWidth / (labels.length + 1);
	const colors = CHART_CONSTANTS.DEFAULT_COLORS;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Sankey Chart</title>
			{/* Nodes */}
			<For each={labels}>
				{(_, index) => {
					const i = index();
					const x = padding + i * nodeWidth;
					const value = values[i] || 0;
					const nodeHeight = (value / Math.max(...values, 1)) * chartHeight * 0.8;
					const y = padding + (chartHeight - nodeHeight) / 2;
					return (
						<rect
							x={x}
							y={y}
							width={nodeWidth * 0.8}
							height={nodeHeight}
							fill={colors[i % colors.length]}
							class="hover:opacity-80 transition-opacity"
						/>
					);
				}}
			</For>
			{/* Links */}
			<For each={values}>
				{(value, index) => {
					const i = index();
					if (i < values.length - 1) {
						const x1 = padding + i * nodeWidth + nodeWidth * 0.8;
						const x2 = padding + (i + 1) * nodeWidth;
						const y1 = padding + chartHeight / 2;
						const y2 = padding + chartHeight / 2;
						return (
							<path
								d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
								fill="none"
								stroke={colors[i % colors.length]}
								stroke-width={(value / Math.max(...values, 1)) * 10}
								opacity="0.5"
							/>
						);
					}
					return null;
				}}
			</For>
		</svg>
	);
};
