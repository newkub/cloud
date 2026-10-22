/**
 * StatsBoard — multi-metric dashboard panel (label, value, delta, sparkline slot).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface BoardStat {
	label: string;
	value: string | number;
	/** Delta text, e.g. "+12%" — colored by `trend`. */
	delta?: string;
	trend?: "up" | "down" | "flat";
	/** Small viz slot under the value (sparkline, icon). */
	footer?: JSX.Element;
}

export interface StatsBoardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	stats: BoardStat[];
	title?: string;
	/** Grid columns at sm+. @default "auto" — fits stat count. */
	columns?: 1 | 2 | 3 | 4;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const valueSize = { sm: "text-lg", md: "text-xl", lg: "text-2xl" } as const;
const trendCls = { up: "text-success", down: "text-destructive", flat: "text-muted-foreground" } as const;
const trendGlyph = { up: "▲", down: "▼", flat: "▬" } as const;
const colClass = {
	1: "sm:grid-cols-1",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-4",
} as const;

export function StatsBoard(props: StatsBoardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"stats",
		"title",
		"columns",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const cols = () => {
		const c = Math.min(4, Math.max(1, local.columns ?? (local.stats ?? []).length)) as keyof typeof colClass;
		return colClass[c];
	};
	return (
		<div
			class={`solidui-stats-board ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title}>
				<h3 class={`mb-3 font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
					{local.title}
				</h3>
			</Show>
			<div class={`grid gap-4 ${cols()}`}>
				<For each={local.stats ?? []}>
					{(s) => (
						<div class="min-w-0">
							<div class="text-2xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</div>
							<div class="mt-0.5 flex items-baseline gap-2">
								<span class={`font-bold tabular-nums text-foreground ${valueSize[local.size ?? "md"]}`}>{s.value}</span>
								<Show when={s.delta}>
									<span class={`text-2xs font-medium ${trendCls[s.trend ?? "flat"]}`}>
										<span aria-hidden="true">{trendGlyph[s.trend ?? "flat"]}</span> {s.delta}
									</span>
								</Show>
							</div>
							<Show when={s.footer}>
								<div class="mt-1">{s.footer}</div>
							</Show>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
