import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * True while the element intersects the viewport — a minimal
 * IntersectionObserver flag for externally-owned refs. Respects clipping by
 * scrollable ancestors; re-observes when `ref()` resolves to a new element.
 * For richer control (observer init, `once`, ratio/entry accessors) use
 * `useIntersection`.
 *
 * @param ref — Accessor for the element to observe
 * @param threshold — Visibility ratio(s) required to flip the flag. @default 0
 * @returns Accessor for the in-viewport flag
 *
 * @example
 * let box!: HTMLDivElement;
 * const inView = useInViewport(() => box, 0.5);
 * <Show when={inView()}>visible</Show>
 */
export function useInViewport(ref: Accessor<Element | undefined>, threshold: number | number[] = 0): Accessor<boolean> {
	const [inView, setInView] = createSignal(false);

	createEffect(() => {
		const el = ref();
		if (!el || typeof IntersectionObserver === "undefined") return;
		const io = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold });
		io.observe(el);
		onCleanup(() => {
			io.disconnect();
			setInView(false);
		});
	});

	return inView;
}
