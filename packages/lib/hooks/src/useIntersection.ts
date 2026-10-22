import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface IntersectionState {
	/** Attach to the element to observe */
	ref: (el: HTMLElement) => void;
	/** True while the element intersects the root */
	visible: Accessor<boolean>;
	/** Latest `intersectionRatio` (0–1) */
	ratio: Accessor<number>;
	/** Latest observer entry — `undefined` before the first callback */
	entry: Accessor<IntersectionObserverEntry | undefined>;
}

/**
 * Track whether an element is inside the viewport via IntersectionObserver —
 * re-observes when the bound element changes. `threshold` accepts a single
 * ratio or an array of cutoffs (e.g. `[0, 0.25, 0.5, 1]`); `ratio()` and
 * `entry()` expose the raw values for progressive reveals.
 * Pass `once: true` to disconnect after the first intersection — ideal for
 * scroll-reveal animations.
 *
 * @param options — IntersectionObserverInit plus `once` to disconnect after first intersection
 * @returns `{ ref, visible, ratio, entry }` — attach `ref` to the element
 *
 * @example
 * const { ref, visible } = useIntersection({ threshold: [0, 0.5], once: true });
 * <div ref={ref}>{visible() ? "In view" : "Out of view"}</div>
 */
export function useIntersection(options?: IntersectionObserverInit & { once?: boolean }): IntersectionState {
	const [el, setEl] = createSignal<HTMLElement>();
	const [visible, setVisible] = createSignal(false);
	const [ratio, setRatio] = createSignal(0);
	const [entry, setEntry] = createSignal<IntersectionObserverEntry>();

	createEffect(() => {
		const target = el();
		if (!target || typeof IntersectionObserver === "undefined") return;
		const io = new IntersectionObserver(([e]) => {
			if (!e) return;
			setEntry(e);
			setVisible(e.isIntersecting);
			setRatio(e.intersectionRatio);
			if (e.isIntersecting && options?.once) io.disconnect();
		}, options);
		io.observe(target);
		onCleanup(() => io.disconnect());
	});

	return { ref: setEl, visible, ratio, entry };
}
