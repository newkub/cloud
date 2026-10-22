import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderLineChart = (data: ChartData, options: ChartOptions, width: number, height: number): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const labels = data.labels ?? [];
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

	const areaPoints = `${padding},${padding + chartHeight} ${points} ${padding + chartWidth},${padding + chartHeight}`;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Line Chart</title>
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

			{/* Area fill */}
			{options?.area && <polygon points={areaPoints} fill="currentColor" fill-opacity="0.1" />}

			{/* Line */}
			<polyline
				points={points}
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>

			{/* Data points */}
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

			{/* X-axis labels */}
			<For each={labels}>
				{(label, index) => {
					const i = index();
					const x = padding + (i / (labels.length - 1 || 1)) * chartWidth;
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
