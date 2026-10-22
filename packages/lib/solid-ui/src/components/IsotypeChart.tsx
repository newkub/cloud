/**
 * IsotypeChart — unit-icon rows where each icon stands for a count (pictograph).
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface IsotypeItem {
	label: string;
	value: number;
}

export interface IsotypeChartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: IsotypeItem[];
	/** Units one icon represents. @default 1 */
	unit?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function IsotypeChart(props: IsotypeChartProps) {
	const merged = mergeProps({ unit: 1 }, props);
	const [local, rest] = splitProps(merged, ["class", "children", "data", "unit", "radius", "elevation"]);

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
					const n = Math.max(0, Math.round(d.value / local.unit));
					return (
						<div class="flex items-center gap-3">
							<span class="w-24 shrink-0 truncate text-right text-xs text-muted-foreground">{d.label}</span>
							<span
								class="flex min-w-0 flex-1 flex-wrap gap-1 text-primary"
								role="img"
								aria-label={`${d.label}: ${d.value}`}
							>
								<For each={Array.from({ length: n })}>
									{() => (
										<svg class="h-4 w-4" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
											<circle cx="6" cy="6" r="5" />
										</svg>
									)}
								</For>
							</span>
							<span class="shrink-0 font-mono text-2xs text-muted-foreground tabular-nums">{d.value}</span>
						</div>
					);
				}}
			</For>
			{local.children}
		</div>
	);
}
