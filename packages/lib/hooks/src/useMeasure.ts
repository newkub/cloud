import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * Live bounding rect for an element via ResizeObserver — re-observes when
 * `ref()` resolves to a different element. `undefined` until the first
 * measurement and during SSR.
 *
 * @param ref — Accessor for the element to measure
 * @returns Accessor for the element's `DOMRectReadOnly` (`undefined` before mount)
 *
 * @example
 * let box!: HTMLDivElement;
 * const rect = useMeasure(() => box);
 * <div ref={box}>{rect()?.width.toFixed(0)}×{rect()?.height.toFixed(0)}</div>
 */
export function useMeasure(ref: Accessor<HTMLElement | undefined>): Accessor<DOMRectReadOnly | undefined> {
	const [rect, setRect] = createSignal<DOMRectReadOnly>();

	createEffect(() => {
		const el = ref();
		if (!el || typeof ResizeObserver === "undefined") return;
		setRect(el.getBoundingClientRect());
		const ro = new ResizeObserver(([entry]) => setRect(entry?.contentRect));
		ro.observe(el);
		onCleanup(() => {
			ro.disconnect();
			setRect(undefined);
		});
	});

	return rect;
}
