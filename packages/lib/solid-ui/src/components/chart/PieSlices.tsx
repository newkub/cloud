import { For } from "solid-js";
import type { ChartDataPoint } from "./types";
import { colorOf } from "./utils";

/** Circumference-based pie/donut slices: rotate a circle, stroke a fraction of it. */
export function PieSlices(props: { data: ChartDataPoint[]; r: number; hole: number }) {
	const total = () =>
		Math.max(
			1e-9,
			props.data.reduce((s, d) => s + d.value, 0),
		);
	const C = 2 * Math.PI * props.r;
	let offset = 0;
	return (
		<For each={props.data}>
			{(d, i) => {
				const frac = d.value / total();
				const len = frac * C;
				const el = (
					<circle
						cx={0}
						cy={0}
						r={props.r}
						fill="none"
						stroke={colorOf(d, i())}
						stroke-width={props.r - props.hole}
						stroke-dasharray={`${len} ${C - len}`}
						stroke-dashoffset={-offset * C}
						transform={`rotate(-90)`}
					>
						<title>{`${d.label}: ${d.value}`}</title>
					</circle>
				);
				offset += frac;
				return el;
			}}
		</For>
	);
}
