/**
 * UserMenu — avatar trigger + dropdown with user header and menu items.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { createSignal, For, type JSX, onCleanup, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface UserMenuItem {
	label: string;
	href?: string;
	icon?: JSX.Element;
	/** Secondary line under the label. */
	description?: string;
	/** Keyboard shortcut hint rendered at the end. */
	shortcut?: string;
	onClick?: () => void;
	/** Danger styling (logout/delete). */
	danger?: boolean;
	/** Visual separator after this item. */
	separator?: boolean;
	disabled?: boolean;
}

export interface UserMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	name: string;
	/** Secondary line — email or handle. */
	detail?: string;
	/** Avatar image — falls back to name initial. */
	avatar?: string;
	items: UserMenuItem[];
	/** Open state (controlled). */
	open?: boolean;
	/** Initial open state (uncontrolled). @default false */
	defaultOpen?: boolean;
	/** Called whenever the dropdown opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Whether selecting an item closes the dropdown. @default true */
	closeOnSelect?: boolean;
	/** Disable the avatar trigger. @default false */
	disabled?: boolean;
	/** Extra content rendered at the bottom of the dropdown. */
	footer?: JSX.Element;
	/** Dropdown side. @default "right" */
	align?: "left" | "right";
	size?: "sm" | "md" | "lg";
	/** Corner radius on the dropdown. */
	radius?: Radius;
	/** Shadow elevation on the dropdown. */
	elevation?: Elevation;
}

const avatarSize = { sm: "h-6 w-6 text-2xs", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" } as const;

export function UserMenu(props: UserMenuProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"detail",
		"avatar",
		"items",
		"open",
		"defaultOpen",
		"onOpenChange",
		"closeOnSelect",
		"disabled",
		"footer",
		"align",
		"size",
		"radius",
		"elevation",
	]);
	const [internal, setInternal] = createSignal(local.defaultOpen ?? false);
	const open = () => (local.open !== undefined ? local.open : internal());
	const setOpen = (value: boolean) => {
		if (open() !== value) local.onOpenChange?.(value);
		setInternal(value);
	};
	let root!: HTMLDivElement;
	const onDoc = (e: MouseEvent) => {
		if (!root.contains(e.target as Node)) setOpen(false);
	};
	document.addEventListener("click", onDoc);
	onCleanup(() => document.removeEventListener("click", onDoc));
	useEscapeKey(() => setOpen(false));

	const select = (item: UserMenuItem) => {
		if (item.disabled) return;
		item.onClick?.();
		if (local.closeOnSelect ?? true) setOpen(false);
	};

	return (
		<div ref={root} class={`solidui-user-menu relative inline-block ${local.class ?? ""}`.trim()} {...rest}>
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={open()}
				aria-label={`${local.name} menu`}
				disabled={local.disabled}
				data-state={open() ? "open" : "closed"}
				class={`flex items-center gap-2 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
				onClick={() => setOpen(!open())}
			>
				<span
					class={`flex items-center justify-center overflow-hidden rounded-full bg-primary/15 font-semibold text-primary ${avatarSize[local.size ?? "md"]}`}
				>
					{local.avatar ? (
						<img src={local.avatar} alt="" class="h-full w-full object-cover" />
					) : (
						(local.name ?? "").charAt(0).toUpperCase()
					)}
				</span>
				<svg
					class={`h-3 w-3 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
			<Show when={open()}>
				<div
					role="menu"
					data-state="open"
					class={`absolute top-full z-50 mt-2 min-w-44 border border-border bg-surface p-1 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.align === "left" ? "left-0" : "right-0"}`}
				>
					<div class="border-b border-border px-3 py-2">
						<div class="truncate text-xs font-semibold text-foreground">{local.name}</div>
						<Show when={local.detail}>
							<div class="truncate text-2xs text-muted-foreground">{local.detail}</div>
						</Show>
					</div>
					<For each={local.items ?? []}>
						{(item) => (
							<>
								{item.href ? (
									<a
										href={item.href}
										role="menuitem"
										aria-disabled={item.disabled || undefined}
										class={`flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-xs transition-colors focus-visible:outline-none ${
											item.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"
										} ${item.disabled ? "pointer-events-none opacity-50" : ""}`}
										onClick={() => select(item)}
									>
										<span class="flex min-w-0 items-center gap-2">
											{item.icon}
											<span class="min-w-0">
												<span class="block truncate">{item.label}</span>
												<Show when={item.description}>
													<span class="block truncate text-2xs opacity-70">{item.description}</span>
												</Show>
											</span>
										</span>
										<Show when={item.shortcut}>
											<kbd class="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-2xs opacity-80">
												{item.shortcut}
											</kbd>
										</Show>
									</a>
								) : (
									<button
										type="button"
										role="menuitem"
										disabled={item.disabled}
										class={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-left text-xs transition-colors focus-visible:outline-none disabled:opacity-50 ${
											item.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"
										}`}
										onClick={() => select(item)}
									>
										<span class="flex min-w-0 items-center gap-2">
											{item.icon}
											<span class="min-w-0">
												<span class="block truncate">{item.label}</span>
												<Show when={item.description}>
													<span class="block truncate text-2xs opacity-70">{item.description}</span>
												</Show>
											</span>
										</span>
										<Show when={item.shortcut}>
											<kbd class="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-2xs opacity-80">
												{item.shortcut}
											</kbd>
										</Show>
									</button>
								)}
								<Show when={item.separator}>
									<hr class="my-1 border-t border-border" />
								</Show>
							</>
						)}
					</For>
					<Show when={local.footer}>
						<div class="border-t border-border px-3 py-2">{local.footer}</div>
					</Show>
				</div>
			</Show>
		</div>
	);
}
