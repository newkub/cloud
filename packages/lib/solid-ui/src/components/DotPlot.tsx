/**
 * DotPlot — rows of unit dots per category (Cleveland-style dot matrix).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DotPlotItem {
	label: string;
	value: number;
	/** Optional per-item color token — defaults to primary. */
	color?: string;
}

export interface DotPlotProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: DotPlotItem[];
	/** Max dots per row — values are scaled down when exceeded. @default 20 */
	maxDots?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function DotPlot(props: DotPlotProps) {
	const merged = mergeProps({ maxDots: 20 }, props);
	const [local, rest] = splitProps(merged, ["class", "data", "maxDots", "radius", "elevation", "children"]);

	const max = () => Math.max(1, ...(local.data ?? []).map((d) => d.value));

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
					const dots = Math.max(1, Math.round((d.value / max()) * local.maxDots));
					return (
						<div class="flex items-center gap-3">
							<span class="w-24 shrink-0 truncate text-right text-xs text-muted-foreground">{d.label}</span>
							<svg
								class="h-3 min-w-0 flex-1"
								viewBox={`0 0 ${local.maxDots * 12} 12`}
								preserveAspectRatio="xMinYMid meet"
								role="img"
								aria-label={`${d.label}: ${d.value}`}
							>
								<For each={Array.from({ length: dots })}>
									{(_, i) => (
										<circle
											cx={i() * 12 + 5}
											cy={6}
											r={4}
											fill="currentColor"
											class={d.color ?? "text-primary"}
											style={d.color ? { color: d.color } : undefined}
										/>
									)}
								</For>
							</svg>
							<span class="shrink-0 font-mono text-2xs text-muted-foreground tabular-nums">{d.value}</span>
						</div>
					);
				}}
			</For>
		</div>
	);
}
