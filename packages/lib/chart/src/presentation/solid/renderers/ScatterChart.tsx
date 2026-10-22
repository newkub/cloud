import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderScatterChart = (
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

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Scatter Chart</title>
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
			{/* Scatter points */}
			<For each={values}>
				{(value, index) => {
					const i = index();
					const x = padding + (i / (values.length - 1 || 1)) * chartWidth;
					const y = padding + chartHeight - (value / maxValue) * chartHeight;
					return (
						<circle
							cx={x}
							cy={y}
							r={CHART_CONSTANTS.DEFAULT_POINT_RADIUS}
							fill="currentColor"
							class="hover:r-6 transition-all"
						/>
					);
				}}
			</For>
		</svg>
	);
};
