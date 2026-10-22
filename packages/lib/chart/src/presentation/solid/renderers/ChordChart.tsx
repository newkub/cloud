import { For, type JSX } from "solid-js";
import { CHART_CONSTANTS } from "../../../shared/constants/index";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { firstValues, labelsOf, PICK } from "./radial-helpers";

/** Chord — segments on a ring with inner ribbons between them. */
export const renderChordChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = firstValues(data);
	const total = values.reduce((s, v) => s + v, 0) || 1;
	const cx = width / 2;
	const cy = height / 2;
	const r = Math.min(width, height) / 2 - CHART_CONSTANTS.DEFAULT_PADDING;
	let angle = -Math.PI / 2;
	const segs = values.map((v, i) => {
		const a0 = angle;
		const a1 = angle + (v / total) * Math.PI * 2;
		angle = a1;
		return { a0, a1, i, v };
	});
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Chord Chart</title>
			{/* Ribbons: link each segment to the next */}
			<For each={segs}>
				{(s) => {
					const next = segs[(s.i + 1) % segs.length] ?? s;
					const m1 = (s.a0 + s.a1) / 2;
					const m2 = (next.a0 + next.a1) / 2;
					const p = (a: number) => [cx + (r - 12) * Math.cos(a), cy + (r - 12) * Math.sin(a)];
					const [x1, y1] = p(m1);
					const [x2, y2] = p(m2);
					return (
						<path
							d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
							fill="none"
							stroke={PICK(s.i)}
							stroke-width="3"
							opacity="0.4"
						/>
					);
				}}
			</For>
			<For each={segs}>
				{(s) => {
					const x1 = cx + r * Math.cos(s.a0);
					const y1 = cy + r * Math.sin(s.a0);
					const x2 = cx + r * Math.cos(s.a1);
					const y2 = cy + r * Math.sin(s.a1);
					const large = s.a1 - s.a0 > Math.PI ? 1 : 0;
					return (
						<path
							d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
							fill="none"
							stroke={PICK(s.i)}
							stroke-width="12"
						>
							<title>{`${labelsOf(data)[s.i] ?? s.i}: ${s.v}`}</title>
						</path>
					);
				}}
			</For>
		</svg>
	);
};
