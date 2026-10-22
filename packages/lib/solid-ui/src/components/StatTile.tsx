/**
 * StatTile — compact stat tile with icon on top, value, label, and optional trend.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface StatTileProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
	/** Stat label */
	label: string;
	/** Stat value */
	value: string | number;
	/** Decorative icon rendered above the value */
	icon?: JSX.Element;
	/** Trend direction indicator */
	trend?: "up" | "down" | "flat";
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Mark the tile as selected (requires `onClick` to be interactive) @default false */
	selected?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const pad = { sm: "p-2.5", md: "p-3", lg: "p-4" } as const;
const valueSize = { sm: "text-base", md: "text-lg", lg: "text-xl" } as const;
const trendCls = { up: "text-success", down: "text-destructive", flat: "text-muted-foreground" } as const;
const trendGlyph = { up: "▲", down: "▼", flat: "▬" } as const;
const trendText = { up: "trending up", down: "trending down", flat: "unchanged" } as const;

export function StatTile(props: StatTileProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"label",
		"value",
		"icon",
		"trend",
		"size",
		"selected",
		"radius",
		"onClick",
	]);
	const interactive = () => local.onClick !== undefined || local.selected !== undefined;
	const cls = () =>
		`solidui-stat-tile w-full border text-left ${local.selected ? "border-primary bg-primary/5 ring-1 ring-ring" : "border-border bg-surface"} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${interactive() ? "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none" : ""} ${local.class ?? ""}`.trim();
	const content = () => (
		<>
			<div class="flex items-center justify-between gap-2">
				<Show when={local.icon}>
					<span class="text-muted-foreground" aria-hidden="true">
						{local.icon}
					</span>
				</Show>
				<Show when={local.trend}>
					<span class={`text-xs ${trendCls[local.trend ?? "flat"]}`}>
						<span aria-hidden="true">{trendGlyph[local.trend ?? "flat"]}</span>
						<span class="sr-only">{trendText[local.trend ?? "flat"]}</span>
					</span>
				</Show>
			</div>
			<p class={`mt-1 font-bold tracking-tight tabular-nums ${valueSize[local.size ?? "md"]}`}>{local.value}</p>
			<p class="mt-0.5 text-xs text-muted-foreground">{local.label}</p>
		</>
	);
	return (
		<Show
			when={interactive()}
			fallback={
				<div class={cls()} {...(rest as JSX.HTMLAttributes<HTMLDivElement>)}>
					{content()}
				</div>
			}
		>
			<button type="button" class={cls()} aria-pressed={local.selected} onClick={local.onClick} {...rest}>
				{content()}
			</button>
		</Show>
	);
}
