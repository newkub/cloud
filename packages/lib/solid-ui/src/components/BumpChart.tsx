/**
 * BumpChart — rank positions over time; each series is a line through its rank per period.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BumpSeries {
	label: string;
	/** Rank per period — 1 = top. */
	ranks: number[];
}

export interface BumpChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: BumpSeries[];
	periods?: string[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

const palette = [
	"text-primary",
	"text-info",
	"text-success",
	"text-warning",
	"text-destructive",
	"text-muted-foreground",
];

export function BumpChart(props: BumpChartProps) {
	const merged = mergeProps({ width: 400, height: 200 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"data",
		"periods",
		"width",
		"height",
		"radius",
		"elevation",
		"children",
	]);

	const nPeriods = () => Math.max(1, ...(local.data ?? []).map((s) => s.ranks.length), local.periods?.length ?? 0);
	const nSeries = () => Math.max(1, (local.data ?? []).length);
	const x = (p: number) => 40 + (p / Math.max(1, nPeriods() - 1)) * (local.width - 80);
	const y = (rank: number) => 24 + ((rank - 1) / nSeries()) * (local.height - 48);

	return (
		<div
			class={[
				"w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="h-52 w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Bump chart">
				<For each={Array.from({ length: nPeriods() })}>
					{(_, p) => (
						<text x={x(p())} y={14} text-anchor="middle" font-size="9" class="fill-muted-foreground">
							{local.periods?.[p()] ?? `P${p() + 1}`}
						</text>
					)}
				</For>
				<For each={local.data ?? []}>
					{(s, si) => {
						const cls = palette[si() % palette.length];
						const pts = s.ranks.map((r, p) => `${x(p)},${y(r)}`).join(" ");
						const last = s.ranks.length - 1;
						return (
							<g class={cls}>
								<polyline
									points={pts}
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<For each={s.ranks}>{(r, p) => <circle cx={x(p())} cy={y(r)} r="3" fill="currentColor" />}</For>
								<text x={x(last) + 8} y={y(s.ranks[last]) + 3} font-size="9" class="fill-foreground font-medium">
									{s.label}
								</text>
							</g>
						);
					}}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
