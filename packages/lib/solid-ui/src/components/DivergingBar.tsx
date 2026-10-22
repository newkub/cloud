/**
 * DivergingBar — signed bars extending left/right from a center axis.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface DivergingItem {
	label: string;
	value: number;
}

export interface DivergingBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	data?: DivergingItem[];
	radius?: Radius;
	elevation?: Elevation;
}

export function DivergingBar(props: DivergingBarProps) {
	const [local, rest] = splitProps(props, ["class", "children", "data", "radius", "elevation"]);

	const max = () => Math.max(1, ...(local.data ?? []).map((d) => Math.abs(d.value)));

	return (
		<div
			class={[
				"w-full space-y-1.5",
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
					const w = `${((Math.abs(d.value) / max()) * 50).toFixed(1)}%`;
					const neg = d.value < 0;
					return (
						<div class="flex items-center gap-3">
							<span class="w-24 shrink-0 truncate text-right text-xs text-muted-foreground">{d.label}</span>
							<div class="relative h-3.5 min-w-0 flex-1" role="img" aria-label={`${d.label}: ${d.value}`}>
								<span class="absolute left-1/2 top-0 h-full w-px bg-border" />
								<span
									class={`absolute top-0.5 h-2.5 rounded-sm ${neg ? "bg-destructive" : "bg-primary"}`}
									style={neg ? { right: "50%", width: w } : { left: "50%", width: w }}
								/>
							</div>
							<span
								class={`shrink-0 font-mono text-2xs tabular-nums ${neg ? "text-destructive" : "text-muted-foreground"}`}
							>
								{d.value > 0 ? `+${d.value}` : d.value}
							</span>
						</div>
					);
				}}
			</For>
			{local.children}
		</div>
	);
}
