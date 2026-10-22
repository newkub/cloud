import { type Accessor, createSignal } from "solid-js";

export interface RovingTabindexOptions {
	/** Arrow-key axis — `"vertical"` uses Up/Down, `"horizontal"` uses Left/Right. @default "vertical" */
	orientation?: "vertical" | "horizontal";
	/** Wrap past the first/last item. @default true */
	loop?: boolean;
	/** Initially active item index. @default 0 */
	initialIndex?: number;
	/** Selector for the items inside `ref()`. @default "[tabindex]" */
	itemSelector?: string;
}

export interface RovingItemProps {
	/** `0` for the active item, `-1` for the rest — spread onto each item */
	tabindex: number;
	/** Arrow/Home/End navigation handler — spread onto each item */
	onKeyDown: (e: KeyboardEvent) => void;
	/** Marks the item active when it receives focus (e.g. mouse click) */
	onFocus: () => void;
}

export interface RovingTabindexControls {
	/** Index of the item that is currently in the tab order */
	activeIndex: Accessor<number>;
	/** Set the active index — clamped to the items found inside `ref()` */
	setActiveIndex: (index: number) => void;
	/** Props to spread onto item `i` — `{ tabindex, onKeyDown, onFocus }` */
	getItemProps: (index: number) => RovingItemProps;
}

/**
 * Roving tabindex for list/menu children — exactly one item keeps
 * `tabindex={0}` so Tab enters the widget once, arrows move between items
 * (orientation-aware, optionally looping, plus Home/End), and the newly
 * active item is focused. Items are located inside `ref()` via
 * `itemSelector` (default `[tabindex]` — the attribute `getItemProps` sets).
 *
 * @param ref — Accessor for the container element
 * @param options — `orientation`, `loop`, `initialIndex`, `itemSelector`
 * @returns `{ activeIndex, setActiveIndex, getItemProps }`
 *
 * @example
 * let menu!: HTMLUListElement;
 * const roving = useRovingTabindex(() => menu, { orientation: "vertical" });
 * <ul ref={menu}><For each={items}>{(it, i) =>
 *   <li {...roving.getItemProps(i())}>{it}</li>}</For></ul>
 */
export function useRovingTabindex(
	ref: Accessor<HTMLElement | undefined>,
	options?: RovingTabindexOptions,
): RovingTabindexControls {
	const vertical = () => (options?.orientation ?? "vertical") === "vertical";
	const loop = () => options?.loop ?? true;
	const [activeIndex, setActiveRaw] = createSignal(options?.initialIndex ?? 0);

	const items = (): HTMLElement[] =>
		Array.from(ref()?.querySelectorAll<HTMLElement>(options?.itemSelector ?? "[tabindex]") ?? []);

	const clamp = (n: number) => {
		const len = items().length;
		return len === 0 ? Math.max(0, n) : Math.min(Math.max(0, n), len - 1);
	};

	const move = (next: number) => {
		const len = items().length;
		if (len === 0) return;
		const target = loop() ? ((next % len) + len) % len : Math.min(Math.max(0, next), len - 1);
		setActiveRaw(target);
		items()[target]?.focus();
	};

	const onKeyDown = (i: number, e: KeyboardEvent) => {
		const nextKey = vertical() ? "ArrowDown" : "ArrowRight";
		const prevKey = vertical() ? "ArrowUp" : "ArrowLeft";
		if (e.key === nextKey) {
			e.preventDefault();
			move(i + 1);
		} else if (e.key === prevKey) {
			e.preventDefault();
			move(i - 1);
		} else if (e.key === "Home") {
			e.preventDefault();
			move(0);
		} else if (e.key === "End") {
			e.preventDefault();
			move(items().length - 1);
		}
	};

	return {
		activeIndex,
		setActiveIndex: (index) => setActiveRaw(clamp(index)),
		getItemProps: (index) => ({
			get tabindex() {
				return activeIndex() === index ? 0 : -1;
			},
			onKeyDown: (e) => onKeyDown(index, e),
			onFocus: () => setActiveRaw(index),
		}),
	};
}
