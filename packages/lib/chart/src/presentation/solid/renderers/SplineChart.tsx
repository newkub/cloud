import type { JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";

export const renderSplineChart = (
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

	// Simple spline interpolation using cubic bezier
	const controlPoints = values.map((value, index) => {
		const x = padding + (index / (values.length - 1 || 1)) * chartWidth;
		const y = padding + chartHeight - (value / maxValue) * chartHeight;
		return { x, y };
	});

	let pathData = "";
	if (controlPoints.length > 0) {
		const firstPoint = controlPoints[0];
		if (firstPoint) {
			pathData = `M ${firstPoint.x},${firstPoint.y}`;
			for (let i = 0; i < controlPoints.length - 1; i++) {
				const p0 = controlPoints[i];
				const p1 = controlPoints[i + 1];
				if (p0 && p1) {
					const cp1x = p0.x + (p1.x - p0.x) / 3;
					const cp1y = p0.y;
					const cp2x = p1.x - (p1.x - p0.x) / 3;
					const cp2y = p1.y;
					pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
				}
			}
		}
	}

	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Spline Chart</title>
			<path d={pathData} fill="none" stroke="currentColor" stroke-width={CHART_CONSTANTS.DEFAULT_LINE_WIDTH} />
		</svg>
	);
};
