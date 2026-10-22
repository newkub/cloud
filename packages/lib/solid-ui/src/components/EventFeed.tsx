/**
 * EventFeed — activity/event feed list with icons, timestamps, and unread markers.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface EventFeedItem {
	/** Decorative icon for the event */
	icon?: JSX.Element;
	/** Event title */
	title: string;
	/** Optional description line */
	desc?: string;
	/** Timestamp label */
	time?: string;
	/** Show an unread indicator @default false */
	unread?: boolean;
}

export interface EventFeedProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Events to display */
	events?: EventFeedItem[];
	/** Maximum number of events rendered */
	maxItems?: number;
	/** Text shown when `events` is empty @default "No events" */
	emptyText?: string;
	/** Called when an event row is clicked — makes rows buttons */
	onItemClick?: (event: EventFeedItem, index: number) => void;
	/** Show a divider between rows @default true */
	showDividers?: boolean;
}

export function EventFeed(props: EventFeedProps) {
	const [local, rest] = splitProps(props, ["class", "events", "maxItems", "emptyText", "onItemClick", "showDividers"]);
	const visible = () => (local.events ?? []).slice(0, local.maxItems ?? (local.events ?? []).length);
	const rowContent = (item: EventFeedItem) => (
		<>
			<span
				class="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
				aria-hidden="true"
			>
				{item.icon ?? "•"}
				<Show when={item.unread}>
					<span class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
				</Show>
			</span>
			<span class="min-w-0 flex-1">
				<span
					class={`block truncate text-sm ${item.unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}
				>
					{item.title}
				</span>
				<Show when={item.desc}>
					<span class="block truncate text-xs text-muted-foreground">{item.desc}</span>
				</Show>
			</span>
			<Show when={item.time}>
				<time class="shrink-0 text-xs text-muted-foreground">{item.time}</time>
			</Show>
		</>
	);
	return (
		<ul role="feed" class={`solidui-event-feed ${local.class ?? ""}`.trim()} {...rest}>
			<Show
				when={visible().length > 0}
				fallback={<li class="py-4 text-center text-sm text-muted-foreground">{local.emptyText ?? "No events"}</li>}
			>
				<For each={visible()}>
					{(item, i) => (
						<li class={`${(local.showDividers ?? true) && i() > 0 ? "border-t border-border" : ""}`}>
							<Show
								when={local.onItemClick}
								fallback={<div class="flex items-start gap-3 px-2 py-2.5">{rowContent(item)}</div>}
							>
								<button
									type="button"
									class="flex w-full items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none"
									onClick={() => local.onItemClick?.(item, i())}
								>
									{rowContent(item)}
								</button>
							</Show>
						</li>
					)}
				</For>
			</Show>
		</ul>
	);
}
