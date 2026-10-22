import type { JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderAreaChart = (
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

	const points = values
		.map((value, index) => {
			const x = padding + (index / (values.length - 1 || 1)) * chartWidth;
			const y = padding + chartHeight - (value / maxValue) * chartHeight;
			return `${x},${y}`;
		})
		.join(" ");

	const areaPath = `M ${padding},${padding + chartHeight} ${points} L ${padding + chartWidth},${padding + chartHeight} Z`;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Area Chart</title>
			<defs>
				<linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="currentColor" stop-opacity="0.3" />
					<stop offset="100%" stop-color="currentColor" stop-opacity="0.05" />
				</linearGradient>
			</defs>
			<path d={areaPath} fill="url(#areaGradient)" stroke="none" />
			<polyline points={points} fill="none" stroke="currentColor" stroke-width={CHART_CONSTANTS.DEFAULT_LINE_WIDTH} />
		</svg>
	);
};
