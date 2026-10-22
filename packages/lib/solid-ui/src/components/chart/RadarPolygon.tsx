import { For } from "solid-js";
import type { ChartDataPoint } from "./types";
import { PAD } from "./utils";

/** Radar axes, labels and value polygon. */
export function RadarPolygon(props: { data: ChartDataPoint[]; size: number }) {
	const cx = props.size / 2;
	const cy = props.size / 2;
	const r = props.size / 2 - PAD;
	const max = () => Math.max(1, ...props.data.map((d) => d.value));
	const pts = () =>
		props.data.map((d, i) => {
			const a = (i / props.data.length) * Math.PI * 2 - Math.PI / 2;
			const rr = (d.value / max()) * r;
			return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
		});
	const axes = () =>
		props.data.map((d, i) => {
			const a = (i / props.data.length) * Math.PI * 2 - Math.PI / 2;
			return {
				x: cx + r * Math.cos(a),
				y: cy + r * Math.sin(a),
				label: d.label,
				lx: cx + (r + 10) * Math.cos(a),
				ly: cy + (r + 10) * Math.sin(a),
			};
		});
	return (
		<>
			<For each={axes()}>
				{(a) => (
					<>
						<line x1={cx} y1={cy} x2={a.x} y2={a.y} class="stroke-border" stroke-width="1" />
						<text x={a.lx} y={a.ly} text-anchor="middle" class="fill-muted-foreground text-[10px]">
							{a.label}
						</text>
					</>
				)}
			</For>
			<polygon points={pts().join(" ")} class="fill-primary/25 stroke-primary" stroke-width="1.5" />
		</>
	);
}
