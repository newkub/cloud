/**
 * PieChart — SVG pie/donut slices with optional labels and legend.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export const CHART_PALETTE = [
	"hsl(var(--color-primary))",
	"hsl(var(--color-info))",
	"hsl(var(--color-success))",
	"hsl(var(--color-warning))",
	"hsl(var(--color-destructive))",
	"hsl(var(--color-muted-foreground))",
] as const;

export interface PieSliceData {
	/** Slice label */
	label: string;
	/** Slice value */
	value: number;
	/** Slice color — CSS color; defaults cycle the theme palette */
	color?: string;
}

export interface PieChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Slices */
	data: PieSliceData[];
	/** Accessible label for the svg */
	label?: string;
	/** Chart size — preset or pixel width @default "md" */
	size?: "sm" | "md" | "lg" | number;
	/** Inner radius as a 0–1 fraction of the outer radius — 0 = pie, >0 = donut @default 0 */
	innerRadius?: number;
	/** Show slice labels (percent) @default false */
	showLabels?: boolean;
	/** Show legend @default true */
	showLegend?: boolean;
	/** Text in the donut hole — defaults to the total when innerRadius > 0 */
	centerValue?: string;
	/** Caption under the center value */
	centerLabel?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const px = { sm: 120, md: 160, lg: 220 } as const;
const CX = 50;
const CY = 50;
const R = 46;

function polar(a: number, r: number) {
	return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

export function PieChart(props: PieChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"label",
		"size",
		"innerRadius",
		"showLabels",
		"showLegend",
		"centerValue",
		"centerLabel",
		"radius",
		"elevation",
	]);
	const data = () => local.data ?? [];
	const total = () =>
		Math.max(
			1e-9,
			data().reduce((a, s) => a + s.value, 0),
		);
	const ri = () => R * Math.min(1, Math.max(0, local.innerRadius ?? 0));
	const slices = () => {
		let a0 = -Math.PI / 2;
		return data().map((s, i) => {
			const frac = Math.max(0, s.value) / total();
			const a1 = a0 + frac * Math.PI * 2;
			const mid = (a0 + a1) / 2;
			const large = frac > 0.5 ? 1 : 0;
			const o0 = polar(a0, R);
			const o1 = polar(a1, R);
			let d: string;
			if (frac >= 0.9999) {
				// Full circle — draw as two half arcs.
				const om = polar(a0 + Math.PI, R);
				if (ri() > 0) {
					const im = polar(a0 + Math.PI, ri());
					const i0 = polar(a0, ri());
					d = `M ${o0.x} ${o0.y} A ${R} ${R} 0 1 1 ${om.x} ${om.y} A ${R} ${R} 0 1 1 ${o0.x} ${o0.y} Z M ${i0.x} ${i0.y} A ${ri()} ${ri()} 0 1 0 ${im.x} ${im.y} A ${ri()} ${ri()} 0 1 0 ${i0.x} ${i0.y} Z`;
				} else {
					d = `M ${o0.x} ${o0.y} A ${R} ${R} 0 1 1 ${om.x} ${om.y} A ${R} ${R} 0 1 1 ${o0.x} ${o0.y} Z`;
				}
			} else if (ri() > 0) {
				const i1 = polar(a1, ri());
				const i0 = polar(a0, ri());
				d = `M ${o0.x} ${o0.y} A ${R} ${R} 0 ${large} 1 ${o1.x} ${o1.y} L ${i1.x} ${i1.y} A ${ri()} ${ri()} 0 ${large} 0 ${i0.x} ${i0.y} Z`;
			} else {
				d = `M ${CX} ${CY} L ${o0.x} ${o0.y} A ${R} ${R} 0 ${large} 1 ${o1.x} ${o1.y} Z`;
			}
			const labelR = ri() > 0 ? (R + ri()) / 2 : R * 0.62;
			const lp = polar(mid, labelR);
			a0 = a1;
			return {
				...s,
				color: s.color ?? CHART_PALETTE[i % CHART_PALETTE.length],
				d,
				frac,
				lx: lp.x,
				ly: lp.y,
			};
		});
	};
	return (
		<div
			class={`solidui-pie-chart inline-flex flex-col items-center gap-3 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={typeof local.size === "number" ? local.size : px[local.size ?? "md"]}
				height={typeof local.size === "number" ? local.size : px[local.size ?? "md"]}
				viewBox="0 0 100 100"
				class="max-w-full"
				role="img"
				aria-label={
					local.label ??
					`Pie chart: ${data()
						.map((s) => `${s.label} ${s.value}`)
						.join(", ")}`
				}
			>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<For each={slices()}>
					{(s) => (
						<path d={s.d} fill={s.color} class="stroke-surface" stroke-width="1" fill-rule="evenodd">
							<title>{`${s.label}: ${s.value}`}</title>
						</path>
					)}
				</For>
				<Show when={ri() > 0}>
					<text
						x={CX}
						y={CY - 2}
						text-anchor="middle"
						class="fill-foreground tabular-nums"
						font-size="14"
						font-weight="700"
					>
						{local.centerValue ?? String(Math.round(total() * 100) / 100)}
					</text>
					<Show when={local.centerLabel}>
						<text x={CX} y={CY + 12} text-anchor="middle" class="fill-muted-foreground" font-size="8">
							{local.centerLabel}
						</text>
					</Show>
				</Show>
				<Show when={local.showLabels}>
					<For each={slices()}>
						{(s) => (
							<Show when={s.frac > 0.04}>
								<text
									x={s.lx}
									y={s.ly}
									text-anchor="middle"
									dy="0.35em"
									class="fill-primary-foreground tabular-nums"
									font-size="7"
									font-weight="600"
								>
									{Math.round(s.frac * 100)}%
								</text>
							</Show>
						)}
					</For>
				</Show>
			</svg>
			<Show when={local.showLegend ?? true}>
				<ul class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
					<For each={slices()}>
						{(s) => (
							<li class="flex items-center gap-1.5 text-xs">
								<span class="h-2.5 w-2.5 rounded-sm" style={{ "background-color": s.color }} />
								<span class="text-muted-foreground">{s.label}</span>
								<span class="font-medium tabular-nums">{s.value}</span>
							</li>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
}
