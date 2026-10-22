import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ObservedSize {
	width: number;
	height: number;
}

export interface ResizeObserverControls {
	/** Latest content-box size of the bound element */
	size: Accessor<ObservedSize>;
	/** Observe an extra element — its entries still reach `callback` */
	observe: (el: Element) => void;
	/** Stop observing an element */
	unobserve: (el: Element) => void;
}

/**
 * Generic ResizeObserver — tracks the bound element's size and forwards every
 * entry to an optional callback. Re-observes when `target()` changes.
 * Complements `useElementSize` with a callback + manual observe/unobserve API.
 *
 * @param target — Accessor for the primary element to observe
 * @param callback — Optional entry callback for the bound and extra elements
 * @returns `{ size, observe, unobserve }` controls
 *
 * @example
 * const ro = useResizeObserver(() => box, (e) => log(e.contentRect.width));
 * <div ref={box}>{ro.size().width}px</div>
 */
export function useResizeObserver(
	target: Accessor<Element | undefined>,
	callback?: (entry: ResizeObserverEntry) => void,
): ResizeObserverControls {
	const [size, setSize] = createSignal<ObservedSize>({ width: 0, height: 0 });
	let ro: ResizeObserver | undefined;
	let bound: Element | undefined;

	const ensure = () => {
		if (!ro && typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver((entries) => {
				for (const entry of entries) {
					if (entry.target === bound) {
						setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
					}
					callback?.(entry);
				}
			});
		}
		return ro;
	};

	createEffect(() => {
		const el = target();
		const observer = ensure();
		if (!el || !observer) return;
		bound = el;
		observer.observe(el);
		onCleanup(() => {
			observer.unobserve(el);
			if (bound === el) bound = undefined;
		});
	});

	onCleanup(() => ro?.disconnect());

	return {
		size,
		observe: (el) => ensure()?.observe(el),
		unobserve: (el) => ro?.unobserve(el),
	};
}
