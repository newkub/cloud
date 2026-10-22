import { For, type JSX } from "solid-js";
import type { ChartData, ChartOptions } from "../../../modules/chart/types/index";
import { PAD, PICK } from "./chart-helpers";

const points = (data: ChartData, w: number, h: number, series = 0) => {
	const values = data.datasets?.[series]?.data ?? [];
	const max = Math.max(...values, 1);
	const n = Math.max(1, values.length - 1);
	return values.map((v, i) => ({
		x: PAD + (i / n) * (w - PAD * 2),
		y: PAD + (h - PAD * 2) - (v / max) * (h - PAD * 2),
	}));
};

/** Step line — horizontal then vertical interpolation. */
export const renderStepLineChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const pts = points(data, width, height);
	const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `H ${p.x} V ${p.y}`)).join(" ");
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Step Line Chart</title>
			<path d={d} fill="none" stroke={PICK(0)} stroke-width="2" />
			<For each={pts}>{(p) => <circle cx={p.x} cy={p.y} r="3" fill={PICK(0)} />}</For>
		</svg>
	);
};

/** Stacked area — datasets accumulate into filled bands. */
export const renderStackedAreaChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const datasets = data.datasets ?? [];
	const len = Math.max(...datasets.map((d) => d.data.length), 1);
	const totals = Array.from({ length: len }, (_, i) => datasets.reduce((s, d) => s + (d.data[i] ?? 0), 0));
	const tmax = Math.max(...totals, 1);
	const cw = width - PAD * 2;
	const ch = height - PAD * 2;
	const x = (i: number) => PAD + (i / Math.max(1, len - 1)) * cw;
	const y = (v: number) => PAD + ch - (v / tmax) * ch;
	let base = new Array(len).fill(0);
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Stacked Area Chart</title>
			<For each={datasets}>
				{(ds, di) => {
					const top = base.map((b, i) => b + (ds.data[i] ?? 0));
					const path = `M ${x(0)} ${y(base[0])} ${top.map((t, i) => `L ${x(i)} ${y(t)}`).join(" ")} ${[...top]
						.map((_, i) => `L ${x(len - 1 - i)} ${y(base[len - 1 - i])}`)
						.join(" ")} Z`;
					base = top;
					return <path d={path} fill={PICK(di())} opacity="0.55" />;
				}}
			</For>
		</svg>
	);
};

/** Multi-axis — first two datasets on independent y-scales. */
export const renderMultiAxisChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const d0 = data.datasets?.[0]?.data ?? [];
	const d1 = data.datasets?.[1]?.data ?? [];
	const cw = width - PAD * 2;
	const ch = height - PAD * 2;
	const n = Math.max(d0.length, d1.length, 2) - 1;
	const line = (vals: readonly number[]) => {
		const max = Math.max(...vals, 1);
		return vals.map((v, i) => `${PAD + (i / n) * cw},${PAD + ch - (v / max) * ch}`).join(" ");
	};
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Multi-Axis Chart</title>
			<polyline points={line(d0)} fill="none" stroke={PICK(0)} stroke-width="2" />
			<polyline points={line(d1)} fill="none" stroke={PICK(1)} stroke-width="2" stroke-dasharray="5 3" />
			<text x={PAD} y={PAD - 8} font-size="11" fill={PICK(0)}>
				{data.datasets?.[0]?.label ?? "A"} (left)
			</text>
			<text x={width - PAD} y={PAD - 8} text-anchor="end" font-size="11" fill={PICK(1)}>
				{data.datasets?.[1]?.label ?? "B"} (right)
			</text>
		</svg>
	);
};

/** Streamgraph — stacked areas wiggling around the vertical centre. */
export const renderStreamgraphChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const datasets = data.datasets ?? [];
	const len = Math.max(...datasets.map((d) => d.data.length), 1);
	const totals = Array.from({ length: len }, (_, i) => datasets.reduce((s, d) => s + (d.data[i] ?? 0), 0));
	const tmax = Math.max(...totals, 1);
	const cw = width - PAD * 2;
	const ch = (height - PAD * 2) / 2;
	const cy = height / 2;
	const x = (i: number) => PAD + (i / Math.max(1, len - 1)) * cw;
	let base = totals.map((t) => -t / 2);
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Streamgraph</title>
			<For each={datasets}>
				{(ds, di) => {
					const top = base.map((b, i) => b + (ds.data[i] ?? 0));
					const yTop = (i: number) => cy - ((top[i] ?? 0) / tmax) * ch;
					const yBot = (i: number) => cy - ((base[i] ?? 0) / tmax) * ch;
					const path = `M ${x(0)} ${yBot(0)} ${top.map((_, i) => `L ${x(i)} ${yTop(i)}`).join(" ")} ${top
						.map((_, i) => `L ${x(len - 1 - i)} ${yBot(len - 1 - i)}`)
						.join(" ")} Z`;
					base = top;
					return <path d={path} fill={PICK(di())} opacity="0.7" />;
				}}
			</For>
		</svg>
	);
};

/** Timeline — values as ticks on a horizontal axis. */
export const renderTimelineChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const labels = data.labels ?? [];
	const max = Math.max(...values, 1);
	const n = Math.max(1, values.length - 1);
	const cw = width - PAD * 2;
	const cy = height / 2;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Timeline</title>
			<line x1={PAD} y1={cy} x2={PAD + cw} y2={cy} stroke="#d1d5db" stroke-width="2" />
			<For each={values}>
				{(v, i) => {
					const x = PAD + (i() / n) * cw;
					const h = 10 + (v / max) * 30;
					const above = i() % 2 === 0;
					return (
						<>
							<line x1={x} y1={cy} x2={x} y2={above ? cy - h : cy + h} stroke={PICK(i())} stroke-width="2" />
							<circle cx={x} cy={above ? cy - h : cy + h} r="4" fill={PICK(i())}>
								<title>{`${labels[i()] ?? i()}: ${v}`}</title>
							</circle>
							<text x={x} y={above ? cy - h - 8 : cy + h + 14} text-anchor="middle" font-size="9" fill="#6b7280">
								{labels[i()] ?? ""}
							</text>
						</>
					);
				}}
			</For>
		</svg>
	);
};

/** Gantt — each label is a bar: start = index slot, length ∝ value. */
export const renderGanttChart = (
	data: ChartData,
	_options: ChartOptions,
	width: number,
	height: number,
): JSX.Element => {
	const values = data.datasets?.[0]?.data ?? [];
	const labels = data.labels ?? [];
	const max = Math.max(...values, 1);
	const cw = width - PAD * 2;
	const ch = height - PAD * 2;
	const n = Math.max(1, values.length);
	const rh = ch / n;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img">
			<title>Gantt Chart</title>
			<For each={values}>
				{(v, i) => {
					const start = ((i() * 0.35) % 0.5) * cw;
					return (
						<>
							<rect
								x={PAD + start}
								y={PAD + i() * rh + rh * 0.2}
								width={(v / max) * cw * 0.6}
								height={rh * 0.6}
								rx="3"
								fill={PICK(i())}
								opacity="0.85"
							>
								<title>{`${labels[i()] ?? i()}: ${v}`}</title>
							</rect>
							<text x={PAD - 4} y={PAD + i() * rh + rh * 0.62} text-anchor="end" font-size="10" fill="#6b7280">
								{labels[i()] ?? ""}
							</text>
						</>
					);
				}}
			</For>
		</svg>
	);
};
