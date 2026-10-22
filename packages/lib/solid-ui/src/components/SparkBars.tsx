/**
 * SparkBars — tiny inline SVG bar strip for dense metrics.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SparkBarsProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Bar values */
	data: number[];
	/** Accessible label for the svg */
	label?: string;
	/** Viewport width @default 120 */
	width?: number;
	/** Viewport height @default 24 */
	height?: number;
	/** Highlight the last bar, muting the rest @default false */
	highlightLast?: boolean;
	/** Gap between bars in px @default 2 */
	gap?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SparkBars(props: SparkBarsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"label",
		"width",
		"height",
		"highlightLast",
		"gap",
		"radius",
		"elevation",
	]);
	const w = () => local.width ?? 120;
	const h = () => local.height ?? 24;
	const gap = () => local.gap ?? 2;
	const data = () => local.data ?? [];
	const lo = () => Math.min(0, ...data());
	const hi = () => Math.max(0, ...data());
	const bw = () => {
		const n = data().length;
		return n === 0 ? 0 : Math.max(0, (w() - gap() * (n - 1)) / n);
	};
	const yOf = (v: number) => {
		const range = hi() - lo() || 1;
		return (1 - (v - lo()) / range) * h();
	};
	const bars = () =>
		data().map((v, i) => {
			const y0 = yOf(Math.max(0, v));
			const y1 = yOf(Math.min(0, v));
			return {
				x: i * (bw() + gap()),
				y: y0,
				h: Math.max(1, y1 - y0),
				last: i === data().length - 1,
				v,
			};
		});
	return (
		<span
			class={`solidui-spark-bars inline-flex ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={w()}
				height={h()}
				viewBox={`0 0 ${w()} ${h()}`}
				role="img"
				aria-label={local.label ?? `Spark bars: ${data().length} bars, last ${data().slice(-1)[0] ?? 0}`}
			>
				<Show when={local.label}>
					<title>{local.label}</title>
				</Show>
				<For each={bars()}>
					{(b) => (
						<rect
							x={b.x}
							y={b.y}
							width={bw()}
							height={b.h}
							rx="0.5"
							class={local.highlightLast && !b.last ? "fill-muted-foreground/40" : "fill-primary"}
						>
							<title>{String(b.v)}</title>
						</rect>
					)}
				</For>
			</svg>
		</span>
	);
}
