import { type Accessor, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export interface CycleListControls<T> {
	/** Currently focused element */
	active: Accessor<T>;
	/** Index of the focused element */
	index: Accessor<number>;
	/** Move one step forward (wraps by default) */
	next: () => void;
	/** Move one step backward (wraps by default) */
	prev: () => void;
	/** Jump to a specific index */
	go: (i: number) => void;
}

export interface CycleListOptions {
	/** Initial focus index. @default 0 */
	initialValue?: number;
	/** Wrap around at both ends. @default true */
	circular?: boolean;
}

/**
 * Cycles through a list — `next`/`prev` move the focus index, wrapping unless
 * `circular: false`. The list may be an accessor and stays reactive.
 *
 * @param list — Array or accessor resolving to one
 * @param options — `initialValue`, `circular`
 * @returns `{ active, index, next, prev, go }`
 *
 * @example
 * const theme = useCycleList(["light", "dark", "system"]);
 * <button onClick={theme.next}>{theme.active()}</button>
 */
export function useCycleList<T>(list: MaybeAccessor<readonly T[]>, options?: CycleListOptions): CycleListControls<T> {
	const [index, setIndex] = createSignal(options?.initialValue ?? 0);
	const circular = options?.circular !== false;

	const read = <V>(v: MaybeAccessor<V>): V => (typeof v === "function" ? (v as Accessor<V>)() : v);

	const items = () => read(list);

	function go(i: number) {
		const len = items().length;
		if (len === 0) return;
		setIndex(circular ? ((i % len) + len) % len : Math.max(0, Math.min(len - 1, i)));
	}

	return {
		active: () => items()[index()] as T,
		index,
		next: () => go(index() + 1),
		prev: () => go(index() - 1),
		go,
	};
}
