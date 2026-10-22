/**
 * AreaChart — smooth SVG area under a line for a single numeric series.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AreaChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Series values */
	data: number[];
	/** X-axis labels aligned with `data` */
	labels?: string[];
	/** Accessible label for the svg */
	label?: string;
	/** Viewport width @default 320 */
	width?: number;
	/** Viewport height @default 160 */
	height?: number;
	/** Line stroke — CSS color @default theme primary */
	stroke?: string;
	/** Area fill — CSS color @default theme primary at low opacity */
	fill?: string;
	/** Show point dots @default true */
	showDots?: boolean;
	/** Show horizontal grid lines @default true */
	showGrid?: boolean;
	/** Smooth Catmull-Rom curve @default true */
	smooth?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 10;
const PAD_TOP = 10;
const PAD_BOTTOM = 18;

interface Pt {
	x: number;
	y: number;
}

/** Catmull-Rom → cubic bezier path through the points. */
function smoothPath(pts: Pt[]): string {
	if (pts.length === 0) return "";
	if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
	let d = `M ${pts[0].x} ${pts[0].y}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		const c1x = p1.x + (p2.x - p0.x) / 6;
		const c1y = p1.y + (p2.y - p0.y) / 6;
		const c2x = p2.x - (p3.x - p1.x) / 6;
		const c2y = p2.y - (p3.y - p1.y) / 6;
		d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
	}
	return d;
}

function linePath(pts: Pt[]): string {
	if (pts.length === 0) return "";
	return `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
}

export function AreaChart(props: AreaChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"labels",
		"label",
		"width",
		"height",
		"stroke",
		"fill",
		"showDots",
		"showGrid",
		"smooth",
		"radius",
		"elevation",
	]);
	const w = () => local.width ?? 320;
	const h = () => local.height ?? 160;
	const base = () => h() - PAD_BOTTOM;
	const pts = (): Pt[] => {
		const data = local.data ?? [];
		if (data.length === 0) return [];
		const lo = Math.min(0, ...data);
		const hi = Math.max(0, ...data);
		const range = hi - lo || 1;
		const pw = w() - PAD_X * 2;
		const ph = base() - PAD_TOP;
		const n = Math.max(1, data.length - 1);
		return data.map((v, i) => ({
			x: data.length === 1 ? w() / 2 : PAD_X + (i / n) * pw,
			y: PAD_TOP + ph - ((v - lo) / range) * ph,
		}));
	};
	const curve = () => ((local.smooth ?? true) ? smoothPath(pts()) : linePath(pts()));
	const areaPath = () => {
		const p = pts();
		if (p.length === 0) return "";
		return `${curve()} L ${p[p.length - 1].x} ${base()} L ${p[0].x} ${base()} Z`;
	};
	const summary = () =>
		local.label ?? `Area chart: ${(local.data ?? []).length} points, last ${(local.data ?? []).slice(-1)[0] ?? 0}`;
	return (
		<div
			class={`solidui-area-chart inline-block ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg width={w()} height={h()} viewBox={`0 0 ${w()} ${h()}`} class="max-w-full" role="img" aria-label={summary()}>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<Show when={local.showGrid ?? true}>
					<For each={[0.25, 0.5, 0.75]}>
						{(f) => (
							<line
								x1={PAD_X}
								y1={PAD_TOP + f * (base() - PAD_TOP)}
								x2={w() - PAD_X}
								y2={PAD_TOP + f * (base() - PAD_TOP)}
								class="stroke-border"
								stroke-width="0.5"
								stroke-dasharray="3 3"
							/>
						)}
					</For>
				</Show>
				<line x1={PAD_X} y1={base()} x2={w() - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<path
					d={areaPath()}
					class={local.fill ? "" : "fill-primary/15"}
					style={local.fill ? { fill: local.fill } : undefined}
				/>
				<path
					d={curve()}
					fill="none"
					class={local.stroke ? "" : "stroke-primary"}
					style={local.stroke ? { stroke: local.stroke } : undefined}
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<Show when={local.showDots ?? true}>
					<For each={pts()}>
						{(p) => (
							<circle
								cx={p.x}
								cy={p.y}
								r="3"
								class={local.fill ? "" : "fill-primary"}
								style={local.fill ? { fill: local.fill } : undefined}
							/>
						)}
					</For>
				</Show>
				<For each={local.labels ?? []}>
					{(t, i) => (
						<text x={pts()[i()]?.x ?? 0} y={h() - 4} text-anchor="middle" class="fill-muted-foreground" font-size="8">
							{t}
						</text>
					)}
				</For>
			</svg>
		</div>
	);
}
