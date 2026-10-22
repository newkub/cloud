/**
 * ChartCard — bordered container with title, header stat, actions, and legend slot for a chart.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface ChartCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Card title */
	title: string;
	/** Subtitle under the title */
	description?: string;
	/** Header stat value */
	value?: string | number;
	/** Signed delta under/next to `value`, e.g. 12.5 → "+12.5%" */
	delta?: number;
	/** Delta suffix @default "%" */
	deltaSuffix?: string;
	/** Legend slot rendered under the chart */
	legend?: JSX.Element;
	/** Actions slot in the header corner */
	actions?: JSX.Element;
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-6" } as const;
const valueSize = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" } as const;

export function ChartCard(props: ChartCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"description",
		"value",
		"delta",
		"deltaSuffix",
		"legend",
		"actions",
		"variant",
		"size",
		"radius",
		"elevation",
		"children",
	]);
	const deltaCls = () => ((local.delta ?? 0) >= 0 ? "text-success" : "text-destructive");
	return (
		<div
			class={`solidui-chart-card border ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-start justify-between gap-2">
				<div class="min-w-0">
					<h3 class="text-sm font-semibold text-foreground">{local.title}</h3>
					<Show when={local.description}>
						<p class="mt-0.5 text-xs text-muted-foreground">{local.description}</p>
					</Show>
				</div>
				<Show when={local.actions}>
					<div class="flex shrink-0 items-center gap-1">{local.actions}</div>
				</Show>
			</div>
			<Show when={local.value !== undefined}>
				<div class="mt-1 flex items-baseline gap-2">
					<span class={`font-bold tracking-tight tabular-nums ${valueSize[local.size ?? "md"]}`}>{local.value}</span>
					<Show when={local.delta !== undefined}>
						<span class={`text-xs font-semibold tabular-nums ${deltaCls()}`}>
							<span aria-hidden="true">{(local.delta ?? 0) >= 0 ? "▲" : "▼"}</span>
							<span class="sr-only">{(local.delta ?? 0) >= 0 ? "up" : "down"}</span> {Math.abs(local.delta ?? 0)}
							{local.deltaSuffix ?? "%"}
						</span>
					</Show>
				</div>
			</Show>
			<div class="mt-3">{local.children}</div>
			<Show when={local.legend}>
				<div class="mt-3 border-t border-border pt-3">{local.legend}</div>
			</Show>
		</div>
	);
}
