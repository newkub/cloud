/**
 * StatusGrid — grid of status tiles for services, monitors, or regions.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export type StatusGridStatus = "up" | "down" | "degraded" | "unknown";

export interface StatusGridItem {
	/** Tile label */
	label: string;
	/** Health status */
	status: StatusGridStatus;
	/** Secondary line, e.g. latency or uptime */
	detail?: string;
}

export interface StatusGridProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Tiles to render */
	items: StatusGridItem[];
	/** Grid column count @default 3 */
	columns?: 2 | 3 | 4;
	/** Tile click handler — receives the item */
	onItemClick?: (item: StatusGridItem) => void;
}

const colClass = {
	2: "grid-cols-2",
	3: "grid-cols-2 sm:grid-cols-3",
	4: "grid-cols-2 sm:grid-cols-4",
} as const;

const statusDot = {
	up: "bg-success",
	down: "bg-destructive",
	degraded: "bg-warning",
	unknown: "bg-muted-foreground",
} as const;

const statusText = {
	up: "text-success",
	down: "text-destructive",
	degraded: "text-warning",
	unknown: "text-muted-foreground",
} as const;

export function StatusGrid(props: StatusGridProps) {
	const [local, rest] = splitProps(props, ["class", "items", "columns", "onItemClick"]);
	return (
		<ul
			class={`solidui-status-grid grid list-none gap-2 p-0 ${colClass[local.columns ?? 3]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.items ?? []}>
				{(item) => {
					const inner = (
						<>
							<div class="flex items-center gap-2">
								<span class={`h-2 w-2 shrink-0 rounded-full ${statusDot[item.status]}`} aria-hidden="true" />
								<span class="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{item.label}</span>
								<span class={`shrink-0 text-xs font-medium capitalize ${statusText[item.status]}`}>{item.status}</span>
							</div>
							<Show when={item.detail}>
								<p class="mt-1 truncate text-xs tabular-nums text-muted-foreground">{item.detail}</p>
							</Show>
						</>
					);
					const tileCls = "rounded-md border border-border bg-surface p-3";
					return (
						<li>
							<Show when={local.onItemClick} fallback={<div class={tileCls}>{inner}</div>}>
								<button
									type="button"
									class={`${tileCls} w-full text-left transition-colors motion-reduce:transition-none hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`}
									onClick={() => local.onItemClick?.(item)}
								>
									{inner}
								</button>
							</Show>
						</li>
					);
				}}
			</For>
		</ul>
	);
}
