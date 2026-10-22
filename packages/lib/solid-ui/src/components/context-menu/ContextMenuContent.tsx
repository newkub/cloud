import { For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { elevationMap, radiusMap } from "../../lib/variants";
import type { ContextMenuItem, ContextMenuProps } from "./types";
import { variantMap } from "./use-context-menu";

export function ContextMenuContent(props: {
	open: boolean;
	pos: { x: number; y: number };
	setContentRef: (el: HTMLDivElement | undefined) => void;
	items: ContextMenuItem[];
	variant?: ContextMenuProps["variant"];
	radius?: ContextMenuProps["radius"];
	elevation?: ContextMenuProps["elevation"];
	onItemClick: (item: ContextMenuItem) => void;
}) {
	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])'));
		if (items.length === 0) return;
		const idx = items.indexOf(e.target as HTMLButtonElement);
		let next = -1;
		if (e.key === "ArrowDown") next = idx === -1 ? 0 : (idx + 1) % items.length;
		else if (e.key === "ArrowUp") next = idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = items.length - 1;
		if (next === -1) return;
		e.preventDefault();
		items[next].focus();
	};

	return (
		<Show when={props.open}>
			<Portal>
				<div
					class={`fixed z-popover w-48 max-w-[calc(100vw-1rem)] border p-1 motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${variantMap[props.variant ?? "default"]} ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""}`}
					style={{ top: `${props.pos.y}px`, left: `${props.pos.x}px` }}
					ref={(el) => {
						props.setContentRef(el);
						el?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus();
					}}
					role="menu"
					aria-label="Context menu"
					aria-orientation="vertical"
					data-state="open"
					onKeyDown={onKeyDown}
				>
					<For each={props.items}>
						{(item) => (
							<Show when={!item.separator} fallback={<hr class="my-1 h-px bg-border" />}>
								<button
									type="button"
									role="menuitem"
									disabled={item.disabled}
									data-disabled={item.disabled || undefined}
									class={[
										"flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										item.disabled
											? "cursor-not-allowed text-muted-foreground opacity-50"
											: item.danger
												? "text-destructive hover:bg-destructive/10"
												: "text-foreground hover:bg-primary hover:text-primary-foreground",
									].join(" ")}
									onClick={() => props.onItemClick(item)}
								>
									<span class="flex min-w-0 items-center gap-2">
										<Show when={item.icon}>
											<span class="inline-flex shrink-0 items-center" aria-hidden="true">
												{item.icon}
											</span>
										</Show>
										<span class="truncate">{item.label}</span>
									</span>
									<Show when={item.shortcut}>
										<kbd class="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-xs opacity-80">
											{item.shortcut}
										</kbd>
									</Show>
								</button>
							</Show>
						)}
					</For>
				</div>
			</Portal>
		</Show>
	);
}
