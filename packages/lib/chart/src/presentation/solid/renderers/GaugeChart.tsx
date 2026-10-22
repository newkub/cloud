import type { JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Gauge — single-value semicircle arc (uses dataset[0].data[0] vs max 100). */
export const renderGaugeChart = (
	data: ChartData,
	options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const value = firstValues(data)[0] ?? 0;
	const max = (options as { max?: number }).max ?? 100;
	const frac = Math.min(1, Math.max(0, value / max));
	const cx = width / 2;
	const cy = height - CHART_CONSTANTS.DEFAULT_PADDING;
	const r = Math.min(width / 2, cy) - 8;
	const arc = Math.PI * r;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Gauge Chart</title>
			<path
				d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
				fill="none"
				stroke="#e5e7eb"
				stroke-width={r / 6}
			/>
			<path
				d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
				fill="none"
				stroke={PICK(0)}
				stroke-width={r / 6}
				stroke-linecap="round"
				stroke-dasharray={`${frac * arc} ${arc}`}
			/>
			<text x={cx} y={cy - r / 4} text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">
				{value}
			</text>
			<text x={cx} y={cy - 4} text-anchor="middle" font-size="11" fill="#6b7280">
				{labelsOf(data)[0] ?? `of ${max}`}
			</text>
		</svg>
	);
};
