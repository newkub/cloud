/**
 * AbTestChart - variant bars with a winner highlight.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface AbTestChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
	/** Variant labels */
	variants?: string[];
	/** Winner index */
	winner?: number;
	/** Confidence percent */
	confidence?: number;
}

export function AbTestChart(props: AbTestChartProps) {
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
		"variants",
		"winner",
		"confidence",
	]);
	const vals = () => local.data ?? [];
	const w = () => local.width ?? 400;
	const h = () => local.height ?? 160;
	const max = () => Math.max(1e-9, ...vals());
	const barW = () => (vals().length ? w() / vals().length : w());
	return (
		<div
			class={`solidui-ab-test-chart inline-flex flex-col gap-2 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				width={w()}
				height={h()}
				viewBox={`0 0 ${w()} ${h()}`}
				role="img"
				aria-label={local.label ?? "AbTestChart chart"}
			>
				<For each={vals()}>
					{(v, i) => {
						const bh = (Math.max(0, v) / max()) * (h() - 20);
						return (
							<rect
								x={i() * barW() + 2}
								y={h() - bh}
								width={Math.max(1, barW() - 4)}
								height={bh}
								rx="2"
								class="fill-primary"
							>
								<title>{`${local.labels?.[i()] ?? i() + 1}: ${v}`}</title>
							</rect>
						);
					}}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
