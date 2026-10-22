/**
 * NotificationBell - bell icon with unread badge and a click-out dropdown panel.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface NotificationBellProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Unread count; 0 hides the badge. @default 0 */
	count?: number;
	/** Panel title. @default "Notifications" */
	title?: string;
	/** Panel content — notification rows. */
	children?: JSX.Element;
	/** Called when the badge is clicked with count > 0 (e.g. mark all read). */
	onOpen?: () => void;
	/** Corner radius. */
	radius?: Radius;
}

export function NotificationBell(props: NotificationBellProps) {
	const [local, rest] = splitProps(props, ["class", "count", "title", "children", "onOpen", "radius"]);
	const [open, setOpen] = createSignal(false);
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const onDoc = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		onCleanup(() => document.removeEventListener("mousedown", onDoc));
	});

	const toggle = () => {
		const next = !open();
		setOpen(next);
		if (next) local.onOpen?.();
	};

	return (
		<div ref={root} class={`solidui-notification-bell relative inline-block ${local.class ?? ""}`} {...rest}>
			<button
				type="button"
				class="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				aria-label={local.title ?? "Notifications"}
				aria-expanded={open()}
				aria-haspopup="true"
				onClick={toggle}
			>
				<NamedIcon name="bell" class="h-5 w-5" />
				<Show when={(local.count ?? 0) > 0}>
					<span class="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
						{(local.count ?? 0) > 99 ? "99+" : local.count}
					</span>
				</Show>
			</button>
			<Show when={open()}>
				<div
					class={`absolute right-0 z-popover mt-2 w-80 border border-border bg-popover p-2 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
					role="menu"
				>
					<p class="px-2 py-1 text-xs font-medium text-muted-foreground">{local.title ?? "Notifications"}</p>
					{local.children ?? <p class="px-2 py-4 text-center text-sm text-muted-foreground">No notifications</p>}
				</div>
			</Show>
		</div>
	);
}
