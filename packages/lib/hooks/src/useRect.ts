import { type Accessor, createSignal } from "solid-js";

export interface RectControls {
	/** Last measured bounding rect — `undefined` until the first `refresh()` */
	rect: Accessor<DOMRect | undefined>;
	/** Measure the element now and update `rect` */
	refresh: () => void;
}

/**
 * Measure-on-demand bounding rect — no observers, no listeners. Call
 * `refresh()` when you need fresh geometry (on open, after layout shifts).
 * SSR-safe: `refresh()` no-ops without an element.
 *
 * @param ref — Accessor for the element to measure
 * @returns `{ rect, refresh }` — call `refresh()` to take a measurement
 *
 * @example
 * let tip!: HTMLDivElement;
 * const { rect, refresh } = useRect(() => tip);
 * <button onClick={refresh}>measure</button> {rect()?.top}
 */
export function useRect(ref: Accessor<HTMLElement | undefined>): RectControls {
	const [rect, setRect] = createSignal<DOMRect>();
	const refresh = () => {
		const el = ref();
		if (el) setRect(el.getBoundingClientRect());
	};
	return { rect, refresh };
}
