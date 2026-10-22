/**
 * TopList — ranked top-N list with proportional bars behind each row.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type BarVariant, barVariants } from "../lib/variants";

export interface TopListItem {
	/** Row label */
	label: string;
	/** Numeric value — sets bar width */
	value: number;
	/** Optional leading icon */
	icon?: JSX.Element;
	/** Render the row as a link */
	href?: string;
}

export interface TopListProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Rows to rank — sorted descending by value */
	items: TopListItem[];
	/** Bar scale denominator @default max item value */
	max?: number;
	/** Show rank number @default true */
	showRank?: boolean;
	/** Cap rendered rows */
	limit?: number;
	/** Bar fill token @default "default" (primary) */
	barColor?: BarVariant;
	/** Row click handler — receives the item */
	onItemClick?: (item: TopListItem) => void;
}

export function TopList(props: TopListProps) {
	const [local, rest] = splitProps(props, ["class", "items", "max", "showRank", "limit", "barColor", "onItemClick"]);
	const sorted = () =>
		[...(local.items ?? [])].sort((a, b) => b.value - a.value).slice(0, local.limit ?? Number.POSITIVE_INFINITY);
	const max = () => local.max ?? Math.max(1, ...sorted().map((i) => i.value));

	return (
		<ul class={`solidui-top-list list-none space-y-1 p-0 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={sorted()}>
				{(item, index) => {
					const inner = (
						<>
							<div
								class={`absolute inset-y-0 left-0 rounded-sm transition-[width] motion-reduce:transition-none ${barVariants[local.barColor ?? "default"]} opacity-15`}
								style={{ width: `${(item.value / max()) * 100}%` }}
								aria-hidden="true"
							/>
							<span class="relative flex items-center gap-2 px-2 py-1.5">
								<Show when={local.showRank ?? true}>
									<span class="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
										{index() + 1}
									</span>
								</Show>
								<Show when={item.icon}>
									<span class="shrink-0 text-muted-foreground" aria-hidden="true">
										{item.icon}
									</span>
								</Show>
								<span class="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{item.label}</span>
								<span class="shrink-0 text-sm font-semibold tabular-nums text-foreground">{item.value}</span>
							</span>
						</>
					);
					const rowCls =
						"relative block overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
					return (
						<li>
							{item.href ? (
								<a href={item.href} class={rowCls} onClick={() => local.onItemClick?.(item)}>
									{inner}
								</a>
							) : local.onItemClick ? (
								<button type="button" class={`${rowCls} w-full text-left`} onClick={() => local.onItemClick?.(item)}>
									{inner}
								</button>
							) : (
								<div class={rowCls}>{inner}</div>
							)}
						</li>
					);
				}}
			</For>
		</ul>
	);
}
