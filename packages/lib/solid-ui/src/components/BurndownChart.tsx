/**
 * BurndownChart — sprint burndown with ideal guideline and actual remaining-points line.
 */
import { For, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BurndownChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Sprint length in days */
	days: number;
	/** Total points at sprint start (ideal line goes to 0) */
	ideal: number;
	/** Remaining points per day, index 0 = day 0 @default [] */
	actual?: number[];
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
const PAD_TOP = 10;
const PAD_BOTTOM = 18;

export function BurndownChart(props: BurndownChartProps) {
	const merged = mergeProps({ width: 320, height: 160 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"days",
		"ideal",
		"actual",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const base = () => local.height - PAD_BOTTOM;
	const span = () => Math.max(1, ...(local.actual ?? []), local.ideal);
	const x = (day: number) => PAD_X + (day / Math.max(1, local.days)) * (local.width - PAD_X * 2);
	const y = (v: number) => base() - (v / span()) * (base() - PAD_TOP);

	const actualPath = () => {
		const pts = (local.actual ?? []).map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
		return pts.length ? `M${pts.join(" L")}` : "";
	};

	return (
		<div
			class={[
				"solidui-burndown-chart inline-block",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg
				width={local.width}
				height={local.height}
				viewBox={`0 0 ${local.width} ${local.height}`}
				class="max-w-full"
				role="img"
				aria-label={`Burndown: ${local.days} days, ${local.ideal} points, ${(local.actual ?? []).slice(-1)[0] ?? local.ideal} remaining`}
			>
				<line x1={PAD_X} y1={base()} x2={local.width - PAD_X} y2={base()} class="stroke-border" stroke-width="1" />
				<line
					x1={x(0)}
					y1={y(local.ideal)}
					x2={x(local.days)}
					y2={y(0)}
					class="stroke-muted-foreground"
					stroke-width="1.5"
					stroke-dasharray="4 3"
				/>
				<Show when={(local.actual ?? []).length > 0}>
					<path
						d={actualPath()}
						fill="none"
						class="stroke-primary"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<For each={local.actual ?? []}>{(v, i) => <circle cx={x(i())} cy={y(v)} r="2.5" class="fill-primary" />}</For>
				</Show>
				<For each={[0, local.days]}>
					{(d) => (
						<text x={x(d)} y={local.height - 4} text-anchor="middle" font-size="8" class="fill-muted-foreground">
							D{d}
						</text>
					)}
				</For>
				<text x={PAD_X} y={PAD_TOP} font-size="8" class="fill-muted-foreground tabular-nums">
					{local.ideal}
				</text>
			</svg>
			{local.children}
		</div>
	);
}
