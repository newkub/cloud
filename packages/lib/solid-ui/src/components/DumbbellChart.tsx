/**
 * DumbbellChart — two dots joined by a line per row, for before/after or range comparisons.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DumbbellItem {
	label: string;
	from: number;
	to: number;
}

export interface DumbbellChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: DumbbellItem[];
	/** Pair labels shown in the legend row. @default ["From","To"] */
	series?: [string, string];
	radius?: Radius;
	elevation?: Elevation;
}

export function DumbbellChart(props: DumbbellChartProps) {
	const merged = mergeProps({ series: ["From", "To"] as [string, string] }, props);
	const [local, rest] = splitProps(merged, ["class", "data", "series", "radius", "elevation", "children"]);

	const max = () => Math.max(1, ...(local.data ?? []).flatMap((d) => [d.from, d.to]));

	return (
		<div
			class={[
				"w-full space-y-2",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<For each={local.data ?? []}>
				{(d) => {
					const lo = Math.min(d.from, d.to) / max();
					const hi = Math.max(d.from, d.to) / max();
					const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
					const w = () => `${((hi - lo) * 100).toFixed(1)}%`;
					return (
						<div class="flex items-center gap-3">
							<span class="w-24 shrink-0 truncate text-right text-xs text-muted-foreground">{d.label}</span>
							<div class="relative h-4 min-w-0 flex-1" role="img" aria-label={`${d.label}: ${d.from} → ${d.to}`}>
								<span
									class="absolute top-1/2 h-0.5 -translate-y-1/2 rounded bg-muted-foreground/40"
									style={{ left: pct(lo), width: w() }}
								/>
								<span
									class="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground"
									style={{ left: pct(d.from / max()) }}
									title={`${local.series[0]}: ${d.from}`}
								/>
								<span
									class="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
									style={{ left: pct(d.to / max()) }}
									title={`${local.series[1]}: ${d.to}`}
								/>
							</div>
							<span class="shrink-0 font-mono text-2xs text-muted-foreground tabular-nums">
								{d.from}→{d.to}
							</span>
						</div>
					);
				}}
			</For>
			{local.children}
		</div>
	);
}
