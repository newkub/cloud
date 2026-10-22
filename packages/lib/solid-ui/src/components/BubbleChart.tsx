/**
 * BubbleChart - scatter points sized by a third value.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BubbleChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Series values */
	data?: number[];
	/** Category labels */
	labels?: string[];
	/** Accessible svg label */
	label?: string;
	/** Chart width px @default 400 */
	width?: number;
	/** Chart height px @default 160 */
	height?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Points {x,y,size,label} */
	points?: { x: number; y: number; size?: number; label?: string }[];
}

export function BubbleChart(props: BubbleChartProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"data",
		"labels",
		"label",
		"width",
		"height",
		"radius",
		"elevation",
		"children",
		"points",
	]);
	const vals = () => local.data ?? [];
	const total = () =>
		Math.max(
			1e-9,
			vals().reduce((a, b) => a + Math.max(0, b), 0),
		);
	const size = () => local.width ?? 120;
	const palette = [
		"fill-primary",
		"fill-info",
		"fill-success",
		"fill-warning",
		"fill-destructive",
		"fill-muted-foreground",
	];
	const arcs = () => {
		let acc = 0;
		return vals().map((v, i) => {
			const f0 = acc / total();
			acc += Math.max(0, v);
			const f1 = acc / total();
			const c = size() / 2;
			const r = c - 6;
			const p0 = {
				x: c + r * Math.cos(f0 * Math.PI * 2 - Math.PI / 2),
				y: c + r * Math.sin(f0 * Math.PI * 2 - Math.PI / 2),
			};
			const p1 = {
				x: c + r * Math.cos(f1 * Math.PI * 2 - Math.PI / 2),
				y: c + r * Math.sin(f1 * Math.PI * 2 - Math.PI / 2),
			};
			const large = f1 - f0 > 0.5 ? 1 : 0;
			return {
				d: `M ${c} ${c} L ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Z`,
				cls: palette[i % palette.length],
				label: local.labels?.[i] ?? `${i + 1}`,
				v,
			};
		});
	};
	return (
		<div
			class={`solidui-bubble-chart inline-flex flex-col items-center gap-2 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={size()}
				height={size()}
				viewBox={`0 0 ${size()} ${size()}`}
				role="img"
				aria-label={local.label ?? "BubbleChart chart"}
			>
				<For each={arcs()}>
					{(a) => (
						<path d={a.d} class={a.cls}>
							<title>{`${a.label}: ${a.v}`}</title>
						</path>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
