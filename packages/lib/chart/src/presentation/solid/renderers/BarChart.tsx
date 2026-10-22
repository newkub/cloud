import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderBarChart = (data: ChartData, _options: ChartOptions, width: number, height: number): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const labels = data.labels ?? [];
	const maxValue = Math.max(...values, 0);
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const barWidth = (chartWidth / values.length) * 0.6;
	const gap = (chartWidth / values.length) * 0.4;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Bar Chart</title>
			{/* Grid lines */}
			<For each={[0, 0.25, 0.5, 0.75, 1]}>
				{(ratio) => (
					<line
						x1={padding}
						y1={padding + chartHeight * (1 - ratio)}
						x2={padding + chartWidth}
						y2={padding + chartHeight * (1 - ratio)}
						stroke="#e5e7eb"
						stroke-width="1"
					/>
				)}
			</For>

			{/* Bars */}
			<For each={values}>
				{(value, index) => {
					const i = index();
					const x = padding + i * (barWidth + gap) + gap / 2;
					const barHeight = (value / maxValue) * chartHeight;
					const y = padding + chartHeight - barHeight;
					return (
						<rect
							x={x}
							y={y}
							width={barWidth}
							height={barHeight}
							fill="currentColor"
							class="hover:opacity-80 transition-opacity"
						/>
					);
				}}
			</For>

			{/* X-axis labels */}
			<For each={labels}>
				{(label, index) => {
					const i = index();
					const x = padding + i * (barWidth + gap) + gap / 2 + barWidth / 2;
					return (
						<text x={x} y={height - 10} text-anchor="middle" font-size="12" fill="#6b7280">
							{label}
						</text>
					);
				}}
			</For>
		</svg>
	);
};
