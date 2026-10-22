import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Polar area — equal-angle sectors, radius proportional to value. */
export const renderPolarAreaChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = firstValues(data);
	const labels = labelsOf(data);
	const max = Math.max(...values, 1);
	const cx = width / 2;
	const cy = height / 2;
	const r = Math.min(width, height) / 2 - CHART_CONSTANTS.DEFAULT_PADDING;
	const n = Math.max(1, values.length);
	const step = (Math.PI * 2) / n;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Polar Area Chart</title>
			<For each={values}>
				{(v, i) => {
					const a0 = i() * step - Math.PI / 2;
					const a1 = a0 + step;
					const rr = Math.max(2, (v / max) * r);
					const x1 = cx + rr * Math.cos(a0);
					const y1 = cy + rr * Math.sin(a0);
					const x2 = cx + rr * Math.cos(a1);
					const y2 = cy + rr * Math.sin(a1);
					const mid = (a0 + a1) / 2;
					return (
						<>
							<path
								d={`M ${cx} ${cy} L ${x1} ${y1} A ${rr} ${rr} 0 0 1 ${x2} ${y2} Z`}
								fill={PICK(i())}
								opacity="0.8"
								class="hover:opacity-100 transition-opacity"
							>
								<title>{`${labels[i()] ?? i()}: ${v}`}</title>
							</path>
							<text
								x={cx + (r + 10) * Math.cos(mid)}
								y={cy + (r + 10) * Math.sin(mid)}
								text-anchor="middle"
								font-size="10"
								fill="#6b7280"
							>
								{labels[i()] ?? ""}
							</text>
						</>
					);
				}}
			</For>
		</svg>
	);
};
