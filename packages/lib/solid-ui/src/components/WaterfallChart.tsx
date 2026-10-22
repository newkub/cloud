/**
 * WaterfallChart — cumulative +/- SVG bars with running-total connectors.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface WaterfallItem {
	/** Column label */
	label: string;
	/** Signed delta — negative draws downward */
	value: number;
}

export interface WaterfallChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Delta columns, in order */
	data: WaterfallItem[];
	/** Accessible label for the svg */
	label?: string;
	/** Viewport width @default 360 */
	width?: number;
	/** Viewport height @default 200 */
	height?: number;
	/** Append a final running-total column @default false */
	showTotal?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const PAD_X = 8;
const PAD_T = 12;
const PAD_B = 18;
const BAR_GAP = 6;

interface Col {
	label: string;
	/** running total before this column */
	start: number;
	/** running total after this column */
	end: number;
	kind: "up" | "down" | "total";
	value: number;
}

export function WaterfallChart(props: WaterfallChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"label",
		"width",
		"height",
		"showTotal",
		"radius",
		"elevation",
	]);
	const w = () => local.width ?? 360;
	const h = () => local.height ?? 200;
	const cols = (): Col[] => {
		const data = local.data ?? [];
		let run = 0;
		const out: Col[] = data.map((d) => {
			const start = run;
			run += d.value;
			return {
				label: d.label,
				start,
				end: run,
				kind: d.value < 0 ? ("down" as const) : ("up" as const),
				value: d.value,
			};
		});
		if (local.showTotal && out.length > 0) {
			out.push({ label: "Total", start: 0, end: run, kind: "total", value: run });
		}
		return out;
	};
	const lo = () => Math.min(0, ...cols().flatMap((c) => [c.start, c.end]));
	const hi = () => Math.max(0, ...cols().flatMap((c) => [c.start, c.end]));
	const yOf = (v: number) => {
		const range = hi() - lo() || 1;
		return PAD_T + (1 - (v - lo()) / range) * (h() - PAD_T - PAD_B);
	};
	const colW = () => {
		const n = cols().length;
		return n === 0 ? 0 : (w() - PAD_X * 2 - BAR_GAP * (n - 1)) / n;
	};
	const colX = (i: number) => PAD_X + i * (colW() + BAR_GAP);
	return (
		<div
			class={`solidui-waterfall-chart inline-block ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={w()}
				height={h()}
				viewBox={`0 0 ${w()} ${h()}`}
				class="max-w-full"
				role="img"
				aria-label={
					local.label ?? `Waterfall chart: ${(local.data ?? []).map((d) => `${d.label} ${d.value}`).join(", ")}`
				}
			>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<line x1={PAD_X} y1={yOf(0)} x2={w() - PAD_X} y2={yOf(0)} class="stroke-border" stroke-width="1" />
				<For each={cols()}>
					{(c, i) => {
						const y = () => yOf(Math.max(c.start, c.end));
						const ch = () => Math.max(1, yOf(Math.min(c.start, c.end)) - yOf(Math.max(c.start, c.end)));
						return (
							<>
								<rect
									x={colX(i())}
									y={y()}
									width={colW()}
									height={ch()}
									rx="1"
									class={
										c.kind === "total"
											? "fill-muted-foreground"
											: c.kind === "down"
												? "fill-destructive"
												: "fill-primary"
									}
								>
									<title>{`${c.label}: ${c.value}`}</title>
								</rect>
								<Show when={i() < cols().length - 1}>
									<line
										x1={colX(i()) + colW()}
										y1={yOf(c.end)}
										x2={colX(i() + 1)}
										y2={yOf(c.end)}
										class="stroke-muted-foreground"
										stroke-width="1"
										stroke-dasharray="2 2"
									/>
								</Show>
								<text
									x={colX(i()) + colW() / 2}
									y={h() - 4}
									text-anchor="middle"
									class="fill-muted-foreground"
									font-size="7"
								>
									{c.label}
								</text>
							</>
						);
					}}
				</For>
			</svg>
		</div>
	);
}
