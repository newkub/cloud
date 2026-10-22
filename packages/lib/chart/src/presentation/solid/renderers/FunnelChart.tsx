import { Index, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderFunnelChart = (
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
	const stepHeight = chartHeight / values.length;
	const colors = CHART_CONSTANTS.DEFAULT_COLORS;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Funnel Chart</title>
			<Index each={values}>
				{(value, index) => {
					const v = value();
					const currentWidth = (v / maxValue) * chartWidth;
					const y = padding + index * stepHeight;
					const nextValue = values[index + 1];
					const nextWidth = nextValue !== undefined ? (nextValue / maxValue) * chartWidth : currentWidth * 0.5;
					const x1 = padding + (chartWidth - currentWidth) / 2;
					const x2 = padding + (chartWidth + currentWidth) / 2;
					const x3 = padding + (chartWidth + nextWidth) / 2;
					const x4 = padding + (chartWidth - nextWidth) / 2;

					return (
						<polygon
							points={`${x1},${y} ${x2},${y} ${x3},${y + stepHeight} ${x4},${y + stepHeight}`}
							fill={colors[index % colors.length]}
							class="hover:opacity-80 transition-opacity"
						/>
					);
				}}
			</Index>
		</svg>
	);
};
