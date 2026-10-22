import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderPieChart = (data: ChartData, _options: ChartOptions, width: number, height: number): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	// Labels available for future axis rendering
	// const labels = data.labels ?? [];
	const total = values.reduce((sum, val) => sum + val, 0);
	const centerX = width / 2;
	const centerY = height / 2;
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const radius = Math.min(width, height) / 2 - padding;

	let currentAngle = 0;
	const colors = CHART_CONSTANTS.DEFAULT_COLORS;

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Pie Chart</title>
			<For each={values}>
				{(value, index) => {
					const i = index();
					const sliceAngle = (value / total) * 2 * Math.PI;
					const endAngle = currentAngle + sliceAngle;

					const x1 = centerX + radius * Math.cos(currentAngle);
					const y1 = centerY + radius * Math.sin(currentAngle);
					const x2 = centerX + radius * Math.cos(endAngle);
					const y2 = centerY + radius * Math.sin(endAngle);

					const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

					const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

					currentAngle = endAngle;

					return <path d={pathData} fill={colors[i % colors.length]} class="hover:opacity-80 transition-opacity" />;
				}}
			</For>
		</svg>
	);
};
