import { type Accessor, createSignal } from "solid-js";

export interface UseTabsOptions<T> {
	/** Initial selection — tab value or index. @default first tab */
	initial?: T | number;
	/** Called with (value, index) when the active tab changes. */
	onChange?: (value: T, index: number) => void;
}

export interface TabsControls<T> {
	/** Reactive tab list. */
	tabs: Accessor<T[]>;
	/** Active tab value — undefined when the list is empty. */
	active: Accessor<T | undefined>;
	/** Index of the active tab — -1 when none. */
	index: Accessor<number>;
	/** Select by value or index — invalid values are ignored. */
	select: (tab: T | number) => void;
	/** `isActive("a")` or `isActive(0)`. */
	isActive: (tab: T | number) => boolean;
}

/**
 * Tab selection over a list — `select`/`isActive` accept a tab value or an
 * index, `active()`/`index()` expose the current one, and the list itself can
 * be a reactive accessor.
 *
 * @param tabs - tab ids, or an accessor returning them
 * @param options - `{ initial, onChange }`
 * @returns `{ tabs, active, index, select, isActive }`
 *
 * @example
 * const t = useTabs(["general", "advanced"], { initial: "general" });
 * <Show when={t.isActive("general")}>…</Show>
 */
export function useTabs<T>(tabs: T[] | Accessor<T[]>, options: UseTabsOptions<T> = {}): TabsControls<T> {
	const list = typeof tabs === "function" ? tabs : () => tabs;
	const resolve = (tab: T | number): T | undefined => {
		const l = list();
		return typeof tab === "number" ? l[tab] : l.includes(tab) ? tab : undefined;
	};
	const initialValue = options.initial !== undefined ? resolve(options.initial) : list()[0];
	const [active, setActive] = createSignal<T | undefined>(initialValue);
	const select = (tab: T | number) => {
		const next = resolve(tab);
		if (next === undefined || next === active()) return;
		const idx = list().indexOf(next);
		setActive(() => next);
		options.onChange?.(next, idx);
	};
	return {
		tabs: list,
		active,
		index: () => {
			const a = active();
			return a === undefined ? -1 : list().indexOf(a);
		},
		select,
		isActive: (tab) => resolve(tab) !== undefined && resolve(tab) === active(),
	};
}
