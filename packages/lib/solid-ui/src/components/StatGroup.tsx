/**
 * StatGroup — row of stats separated by dividers.
 */
import { For, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface StatItem {
	label: string;
	value: string | number;
}

export interface StatGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	stats: StatItem[];
	variant?: SurfaceVariant;
	/** Stat size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const valueSize = { sm: "text-base", md: "text-xl", lg: "text-2xl" } as const;
const pad = { sm: "px-4 py-2", md: "px-5 py-3", lg: "px-6 py-4" } as const;

export function StatGroup(props: StatGroupProps) {
	const [local, rest] = splitProps(props, ["class", "stats", "variant", "size", "radius", "elevation"]);
	return (
		<div
			class={`solidui-stat-group inline-flex max-w-full flex-wrap divide-x divide-border border ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.stats}>
				{(s) => (
					<div class={pad[local.size ?? "md"]}>
						<div class={`font-bold ${valueSize[local.size ?? "md"]}`}>{s.value}</div>
						<div class="text-2xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
					</div>
				)}
			</For>
		</div>
	);
}
