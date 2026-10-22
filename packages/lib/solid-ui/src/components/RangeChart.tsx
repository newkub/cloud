/**
 * RangeChart — low→high band per category (temperature ranges, price spreads).
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface RangeItem {
	label: string;
	low: number;
	high: number;
	/** Optional marker inside the band — e.g. the mean. */
	mark?: number;
}

export interface RangeChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: RangeItem[];
	radius?: Radius;
	elevation?: Elevation;
}

export function RangeChart(props: RangeChartProps) {
	const [local, rest] = splitProps(props, ["class", "children", "data", "radius", "elevation"]);

	const extent = () => {
		const all = (local.data ?? []).flatMap((d) => [d.low, d.high]);
		const min = Math.min(0, ...all);
		const max = Math.max(1, ...all);
		return { min, span: max - min || 1 };
	};

	const pct = (v: number) => `${(((v - extent().min) / extent().span) * 100).toFixed(1)}%`;

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
				{(d) => (
					<div class="flex items-center gap-3">
						<span class="w-24 shrink-0 truncate text-right text-xs text-muted-foreground">{d.label}</span>
						<div class="relative h-4 min-w-0 flex-1" role="img" aria-label={`${d.label}: ${d.low}–${d.high}`}>
							<span class="absolute top-1/2 h-px w-full -translate-y-1/2 bg-border" />
							<span
								class="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary/30"
								style={{ left: pct(d.low), width: `calc(${pct(d.high)} - ${pct(d.low)})` }}
							/>
							{d.mark !== undefined && (
								<span
									class="absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-primary"
									style={{ left: pct(d.mark) }}
									title={`mark: ${d.mark}`}
								/>
							)}
						</div>
						<span class="shrink-0 font-mono text-2xs text-muted-foreground tabular-nums">
							{d.low}–{d.high}
						</span>
					</div>
				)}
			</For>
			{local.children}
		</div>
	);
}
