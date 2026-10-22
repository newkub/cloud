/**
 * SlashMenu — "/" command popup for block editors. Filters `items` by
 * `query`, renders group headers, supports ArrowUp/ArrowDown navigation,
 * Enter to select and Escape to close.
 */
import { createEffect, createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface SlashMenuItem {
	/** Group label rendered as a section header. */
	group: string;
	label: string;
	icon?: JSX.Element;
	/** Right-aligned shortcut/description hint. */
	hint?: string;
	/** Disabled items are skipped by keyboard navigation. */
	disabled?: boolean;
}

export interface SlashMenuProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Whether the popup is visible. @default false */
	open?: boolean;
	/** Text typed after "/" — filters items by label (case-insensitive). @default "" */
	query?: string;
	/** Command items, in display order. */
	items?: SlashMenuItem[];
	/** Called with the highlighted item on Enter/click. */
	onSelect?: (item: SlashMenuItem) => void;
	/** Called on Escape. */
	onClose?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SlashMenu(props: SlashMenuProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"open",
		"query",
		"items",
		"onSelect",
		"onClose",
		"radius",
		"elevation",
	]);
	const [active, setActive] = createSignal(0);

	const filtered = () => {
		const q = (local.query ?? "").trim().toLowerCase();
		const list = local.items ?? [];
		if (!q) return list;
		return list.filter((i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q));
	};

	// Reset highlight whenever the filtered list changes.
	createEffect(() => {
		filtered();
		setActive(0);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		const list = filtered();
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			if (!list.length) return;
			const dir = e.key === "ArrowDown" ? 1 : -1;
			let next = active();
			for (let step = 0; step < list.length; step++) {
				next = (next + dir + list.length) % list.length;
				if (!list[next].disabled) break;
			}
			setActive(next);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const item = list[active()];
			if (item && !item.disabled) local.onSelect?.(item);
		} else if (e.key === "Escape") {
			e.preventDefault();
			local.onClose?.();
		}
	};

	return (
		<Show when={local.open}>
			<div
				role="menu"
				aria-label="Insert block"
				tabIndex={-1}
				onKeyDown={onKeyDown}
				class={`solidui-slash-menu w-64 border border-border bg-surface p-1 shadow-lg focus:outline-none ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<For
					each={filtered()}
					fallback={<p class="m-0 px-3 py-2 text-xs text-muted-foreground">No matching commands</p>}
				>
					{(item, i) => (
						<>
							<Show when={i() === 0 || filtered()[i() - 1].group !== item.group}>
								<div
									role="presentation"
									class="px-2.5 pb-1 pt-2 text-2xs font-semibold uppercase tracking-wide text-muted-foreground"
								>
									{item.group}
								</div>
							</Show>
							<button
								type="button"
								role="menuitem"
								disabled={item.disabled}
								onMouseEnter={() => setActive(i())}
								onClick={() => !item.disabled && local.onSelect?.(item)}
								class={`flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:outline-none disabled:opacity-50 ${
									i() === active() ? "bg-muted text-foreground" : "text-foreground"
								}`}
							>
								<Show when={item.icon}>
									<span class="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
										{item.icon}
									</span>
								</Show>
								<span class="min-w-0 flex-1 truncate">{item.label}</span>
								<Show when={item.hint}>
									<span class="shrink-0 text-2xs text-muted-foreground">{item.hint}</span>
								</Show>
							</button>
						</>
					)}
				</For>
			</div>
		</Show>
	);
}
