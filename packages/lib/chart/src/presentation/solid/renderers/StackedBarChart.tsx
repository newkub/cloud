import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderStackedBarChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const datasets = data.datasets ?? [];
	const labels = data.labels ?? [];
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const barWidth = chartWidth / (labels.length * 1.5);
	const colors = CHART_CONSTANTS.DEFAULT_COLORS;

	// Calculate stacked values
	const stackedValues = labels.map((_, labelIndex) => {
		let cumulative = 0;
		return datasets.map((dataset) => {
			const value = dataset.data[labelIndex] ?? 0;
			const start = cumulative;
			cumulative += value;
			return { start, end: cumulative, value };
		});
	});

	const maxValue = Math.max(...stackedValues.flat().map((s) => s.end), 0);

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Stacked Bar Chart</title>
			<For each={stackedValues}>
				{(stack, labelIndex) => {
					const li = labelIndex();
					const x = padding + li * (barWidth * 1.5);
					return (
						<For each={stack}>
							{(segment, datasetIndex) => {
								const di = datasetIndex();
								const barHeight = (segment.value / maxValue) * chartHeight;
								const y = padding + chartHeight - (segment.end / maxValue) * chartHeight;
								return (
									<rect
										x={x}
										y={y}
										width={barWidth}
										height={barHeight}
										fill={colors[di % colors.length]}
										class="hover:opacity-80 transition-opacity"
									/>
								);
							}}
						</For>
					);
				}}
			</For>
		</svg>
	);
};
