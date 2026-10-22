/**
 * CostChart — stacked cost bars by service per month with a total header and legend.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CostSegment {
	/** Service name */
	name: string;
	/** Cost value */
	value: number;
	/** Segment color — CSS color @default theme palette */
	color?: string;
}

export interface CostMonth {
	/** Month label */
	label: string;
	/** Stacked segments */
	segments: CostSegment[];
}

export interface CostChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Months to plot */
	months: CostMonth[];
	/** Prefix for the total header @default "$" */
	currency?: string;
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 160 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 14;
const PAD_TOP = 12;
const PAD_BOTTOM = 18;

const FILLS = ["fill-primary", "fill-info", "fill-success", "fill-warning", "fill-destructive"];
const DOTS = ["bg-primary", "bg-info", "bg-success", "bg-warning", "bg-destructive"];

export function CostChart(props: CostChartProps) {
	const merged = mergeProps({ currency: "$", width: 320, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"months",
		"currency",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const base = () => local.height - PAD_BOTTOM;
	const names = () => {
		const seen: string[] = [];
		for (const m of local.months ?? []) for (const s of m.segments) if (!seen.includes(s.name)) seen.push(s.name);
		return seen;
	};
	const monthTotal = (m: CostMonth) => m.segments.reduce((t, s) => t + s.value, 0);
	const maxTotal = () => Math.max(1, ...(local.months ?? []).map(monthTotal));
	const total = () => (local.months ?? []).reduce((t, m) => t + monthTotal(m), 0);
	const slot = () => (local.width - PAD_X * 2) / Math.max(1, (local.months ?? []).length);
	const barW = () => Math.max(6, slot() * 0.55);
	const y = (v: number) => base() - (v / maxTotal()) * (base() - PAD_TOP);

	return (
		<div
			class={[
				"solidui-cost-chart inline-block",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<div class="mb-1 flex items-baseline justify-between">
				<span class="text-2xs text-muted-foreground">Total</span>
				<span class="text-sm font-semibold text-foreground tabular-nums">
					{local.currency}
					{total().toLocaleString()}
				</span>
			</div>
			<svg
				width={local.width}
				height={local.height}
				viewBox={`0 0 ${local.width} ${local.height}`}
				class="max-w-full"
				role="img"
				aria-label={`Cost: ${(local.months ?? []).length} months, total ${local.currency}${total().toLocaleString()}`}
			>
				<line x1={PAD_X} y1={base()} x2={local.width - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<For each={local.months ?? []}>
					{(m, i) => {
						const gx = () => PAD_X + i() * slot() + slot() / 2 - barW() / 2;
						let acc = 0;
						const segs = m.segments.map((s) => {
							const y0 = acc;
							acc += s.value;
							return { seg: s, from: y0, to: acc };
						});
						return (
							<>
								<For each={segs}>
									{(r) => (
										<rect
											x={gx()}
											y={y(r.to)}
											width={barW()}
											height={Math.max(0, y(r.from) - y(r.to))}
											class={r.seg.color ? "" : FILLS[names().indexOf(r.seg.name) % FILLS.length]}
											style={r.seg.color ? { fill: r.seg.color } : undefined}
										/>
									)}
								</For>
								<text
									x={gx() + barW() / 2}
									y={local.height - 4}
									text-anchor="middle"
									font-size="8"
									class="fill-muted-foreground"
								>
									{m.label}
								</text>
							</>
						);
					}}
				</For>
			</svg>
			<div class="mt-1 flex flex-wrap items-center gap-3 text-2xs text-muted-foreground">
				<For each={names()}>
					{(n, i) => (
						<span class="inline-flex items-center gap-1">
							<span class={`h-2 w-2 rounded-sm ${DOTS[i() % DOTS.length]}`} />
							{n}
						</span>
					)}
				</For>
			</div>
			{local.children}
		</div>
	);
}
