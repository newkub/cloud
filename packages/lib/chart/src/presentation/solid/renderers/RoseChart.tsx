import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Rose (Nightingale) — same geometry, annotated with values inside slices. */
export const renderRoseChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = firstValues(data);
	const max = Math.max(...values, 1);
	const cx = width / 2;
	const cy = height / 2;
	const r = Math.min(width, height) / 2 - CHART_CONSTANTS.DEFAULT_PADDING;
	const n = Math.max(1, values.length);
	const step = (Math.PI * 2) / n;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Rose Chart</title>
			<For each={values}>
				{(v, i) => {
					const a0 = i() * step - Math.PI / 2 + step * 0.05;
					const a1 = a0 + step * 0.9;
					const rr = Math.max(2, (v / max) * r);
					const x1 = cx + rr * Math.cos(a0);
					const y1 = cy + rr * Math.sin(a0);
					const x2 = cx + rr * Math.cos(a1);
					const y2 = cy + rr * Math.sin(a1);
					return (
						<path
							d={`M ${cx} ${cy} L ${x1} ${y1} A ${rr} ${rr} 0 0 1 ${x2} ${y2} Z`}
							fill={PICK(i())}
							opacity={0.5 + (v / max) * 0.5}
							class="hover:opacity-100 transition-opacity"
						>
							<title>{`${labelsOf(data)[i()] ?? i()}: ${v}`}</title>
						</path>
					);
				}}
			</For>
		</svg>
	);
};
