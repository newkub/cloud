/**
 * MenuList — dropdown-style menu list with icons, shortcuts, separators, and arrow-key navigation.
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

export interface MenuListItem {
	/** Item label. */
	label: string;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Keyboard shortcut hint rendered at the end. */
	shortcut?: string;
	/** Destructive (danger) styling. */
	destructive?: boolean;
	/** Non-interactive state — skipped by keyboard navigation. */
	disabled?: boolean;
	/** Called when the item is selected. */
	onSelect?: () => void;
}

export interface MenuListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Menu items. */
	items: MenuListItem[];
	/** Item indices that render a divider before them. */
	separators?: number[];
	/** Surface treatment. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function MenuList(props: MenuListProps) {
	const [local, rest] = splitProps(props, ["class", "items", "separators", "variant", "radius", "elevation"]);

	const onKeyDown = (e: KeyboardEvent & { currentTarget: HTMLDivElement }) => {
		const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
		if (items.length === 0) return;
		const idx = items.indexOf(e.target as HTMLElement);
		let next = -1;
		if (e.key === "ArrowDown") next = idx === -1 ? 0 : (idx + 1) % items.length;
		else if (e.key === "ArrowUp") next = idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length;
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = items.length - 1;
		if (next === -1) return;
		e.preventDefault();
		items[next].focus();
	};

	const itemCls = (item: MenuListItem) =>
		`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
			item.destructive ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"
		}`;

	return (
		<div
			role="menu"
			aria-label="Menu"
			class={`solidui-menu-list w-48 border p-1 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			onKeyDown={onKeyDown}
			{...rest}
		>
			<For each={local.items}>
				{(item, i) => (
					<>
						<Show when={local.separators?.includes(i())}>
							<hr class="my-1 h-px border-0 bg-border" />
						</Show>
						<div role="none">
							<button
								type="button"
								role="menuitem"
								class={itemCls(item)}
								disabled={item.disabled}
								onClick={() => item.onSelect?.()}
							>
								<Show when={item.icon}>
									<span class="inline-flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
										{item.icon}
									</span>
								</Show>
								<span class="min-w-0 flex-1 truncate">{item.label}</span>
								<Show when={item.shortcut}>
									<kbd class="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
										{item.shortcut}
									</kbd>
								</Show>
							</button>
						</div>
					</>
				)}
			</For>
		</div>
	);
}
