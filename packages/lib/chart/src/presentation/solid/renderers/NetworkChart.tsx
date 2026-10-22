import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Network — nodes on a circle with edges to neighbours, size ∝ value. */
export const renderNetworkChart = (
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
	const pos = values.map((v, i) => {
		const a = (i / n) * Math.PI * 2 - Math.PI / 2;
		return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), r: 6 + (v / max) * 10 };
	});
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Network Chart</title>
			<For each={pos}>
				{(p, i) => {
					const q = pos[(i() + 1) % pos.length] ?? p;
					return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#d1d5db" stroke-width="1.5" />;
				}}
			</For>
			<For each={pos}>
				{(p, i) => (
					<>
						<circle cx={p.x} cy={p.y} r={p.r} fill={PICK(i())} opacity="0.85">
							<title>{`${labels[i()] ?? i()}: ${values[i()]}`}</title>
						</circle>
						<text x={p.x} y={p.y - p.r - 4} text-anchor="middle" font-size="10" fill="#6b7280">
							{labels[i()] ?? ""}
						</text>
					</>
				)}
			</For>
		</svg>
	);
};
