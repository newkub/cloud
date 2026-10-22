/**
 * Leaderboard — ranked entries with medal positions, avatars and metric values.
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

export interface LeaderboardEntry {
	key: string;
	name: string;
	/** Score/value — sorted desc when `sort` is on. */
	value: number;
	/** Metric label next to the value (pts, wins…). */
	unit?: string;
	avatar?: string;
	/** Delta text, e.g. "+2" position change. */
	change?: string;
	changeType?: "up" | "down" | "same";
}

export interface LeaderboardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	entries: LeaderboardEntry[];
	/** Sort by value desc. @default true */
	sort?: boolean;
	/** Max rows. */
	limit?: number;
	/** Highlight this entry key (current user). */
	highlightKey?: string;
	/** Medal colors for top 3. @default true */
	medals?: boolean;
	title?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const medalCls = [
	"bg-warning/20 text-warning",
	"bg-muted-foreground/20 text-muted-foreground",
	"bg-warning/10 text-warning/80",
];
const rowPad = { sm: "px-2 py-1.5", md: "px-3 py-2", lg: "px-4 py-2.5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;
const changeCls = { up: "text-success", down: "text-destructive", same: "text-muted-foreground" } as const;

export function Leaderboard(props: LeaderboardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"entries",
		"sort",
		"limit",
		"highlightKey",
		"medals",
		"title",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const rows = () => {
		const entries = local.entries ?? [];
		const list = (local.sort ?? true) ? [...entries].sort((a, b) => b.value - a.value) : entries;
		return local.limit ? list.slice(0, local.limit) : list;
	};
	return (
		<div
			class={`solidui-leaderboard overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.title}>
				<div
					class={`border-b border-border font-semibold text-foreground ${rowPad[local.size ?? "md"]} ${local.size === "lg" ? "text-base" : "text-sm"}`}
				>
					{local.title}
				</div>
			</Show>
			<ol>
				<For each={rows()}>
					{(e, i) => (
						<li
							class={`flex items-center gap-2.5 border-b border-border/50 last:border-0 ${rowPad[local.size ?? "md"]} ${textSize[local.size ?? "md"]} ${local.highlightKey === e.key ? "bg-primary/5" : ""}`}
						>
							<span
								class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-2xs font-bold ${
									(local.medals ?? true) && i() < 3 ? medalCls[i()] : "text-muted-foreground"
								}`}
							>
								{i() + 1}
							</span>
							<Show when={e.avatar}>
								<img src={e.avatar} alt="" class="h-5 w-5 rounded-full object-cover" />
							</Show>
							<span class="min-w-0 flex-1 truncate font-medium text-foreground">{e.name}</span>
							<Show when={e.change}>
								<span class={`text-2xs tabular-nums ${changeCls[e.changeType ?? "same"]}`}>{e.change}</span>
							</Show>
							<span class="shrink-0 font-mono font-semibold tabular-nums text-foreground">
								{e.value.toLocaleString()}
								<Show when={e.unit}>
									<span class="ml-0.5 font-normal text-muted-foreground">{e.unit}</span>
								</Show>
							</span>
						</li>
					)}
				</For>
			</ol>
		</div>
	);
}
