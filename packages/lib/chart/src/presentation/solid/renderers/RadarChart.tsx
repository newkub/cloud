import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderRadarChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const labels = data.labels ?? [];
	const maxValue = Math.max(...values, 0);
	const centerX = width / 2;
	const centerY = height / 2;
	const padding = CHART_CONSTANTS.DEFAULT_PADDING;
	const radius = Math.min(width, height) / 2 - padding;
	const angleStep = (2 * Math.PI) / values.length;

	const points = values
		.map((value, index) => {
			const angle = index * angleStep - Math.PI / 2;
			const r = (value / maxValue) * radius;
			const x = centerX + r * Math.cos(angle);
			const y = centerY + r * Math.sin(angle);
			return `${x},${y}`;
		})
		.join(" ");

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Radar Chart</title>
			{/* Web */}
			<For each={[0.2, 0.4, 0.6, 0.8, 1]}>
				{(ratio) => {
					const webPoints = values
						.map((_, index) => {
							const angle = index * angleStep - Math.PI / 2;
							const r = ratio * radius;
							const x = centerX + r * Math.cos(angle);
							const y = centerY + r * Math.sin(angle);
							return `${x},${y}`;
						})
						.join(" ");
					return <polygon points={webPoints} fill="none" stroke="#e5e7eb" stroke-width="1" />;
				}}
			</For>
			{/* Data */}
			<polygon points={points} fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2" />
			{/* Labels */}
			<For each={labels}>
				{(label, index) => {
					const i = index();
					const angle = i * angleStep - Math.PI / 2;
					const x = centerX + (radius + 20) * Math.cos(angle);
					const y = centerY + (radius + 20) * Math.sin(angle);
					return (
						<text x={x} y={y} text-anchor="middle" font-size="12" fill="#6b7280">
							{label}
						</text>
					);
				}}
			</For>
		</svg>
	);
};
