import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ScrollSnapState {
	/** Index of the snap child nearest the container's visible center */
	index: Accessor<number>;
}

/**
 * Report which child of a scroll-snap container is active — on each scroll
 * (and on bind) the child whose center is closest to the container's
 * visible center wins. Works for `snap-x` and `snap-y` layouts; the axis
 * is inferred from the scrollable overflow direction. Re-binds when
 * `ref()` resolves to a new element.
 *
 * @param ref — Accessor for the scroll-snap container element
 * @returns `{ index }` accessor for the active child index
 *
 * @example
 * let box!: HTMLDivElement;
 * const { index } = useScrollSnap(() => box);
 * <div ref={box} class="snap-x snap-mandatory overflow-x-auto">…slides…</div>
 * <p>slide {index() + 1}</p>
 */
export function useScrollSnap(ref: Accessor<HTMLElement | undefined>): ScrollSnapState {
	const [index, setIndex] = createSignal(0);

	createEffect(() => {
		const el = ref();
		if (!el || typeof window === "undefined") return;
		const update = () => {
			const children = el.children;
			if (!children.length) {
				setIndex(0);
				return;
			}
			const rect = el.getBoundingClientRect();
			const vertical = el.scrollHeight - el.clientHeight >= el.scrollWidth - el.clientWidth;
			const mid = vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
			let best = 0;
			let bestDist = Number.POSITIVE_INFINITY;
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (!child) continue;
				const r = child.getBoundingClientRect();
				const center = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
				const dist = Math.abs(center - mid);
				if (dist < bestDist) {
					bestDist = dist;
					best = i;
				}
			}
			setIndex(best);
		};
		update();
		el.addEventListener("scroll", update, { passive: true });
		onCleanup(() => {
			el.removeEventListener("scroll", update);
			setIndex(0);
		});
	});

	return { index };
}
