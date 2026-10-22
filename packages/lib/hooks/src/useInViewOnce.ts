import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface InViewOnceState {
	/** True once the element has intersected — latches and never flips back */
	inView: Accessor<boolean>;
}

/**
 * Latching IntersectionObserver — `inView()` turns true the first time the
 * element intersects and stays true (the observer disconnects). Ideal for
 * scroll-reveal animations and lazy-mount triggers. For a non-latching
 * flag use `useInViewport`; for ratio/entry accessors use `useIntersection`.
 *
 * @param ref — Accessor for the element to observe
 * @param options — IntersectionObserverInit (`root`, `rootMargin`, `threshold`)
 * @returns `{ inView }` latched flag accessor
 *
 * @example
 * let el!: HTMLDivElement;
 * const { inView } = useInViewOnce(() => el, { threshold: 0.5 });
 * <div ref={el} class={inView() ? "opacity-100" : "opacity-0"} />
 */
export function useInViewOnce(ref: Accessor<Element | undefined>, options?: IntersectionObserverInit): InViewOnceState {
	const [inView, setInView] = createSignal(false);

	createEffect(() => {
		const el = ref();
		if (!el || inView() || typeof IntersectionObserver === "undefined") return;
		const io = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				setInView(true);
				io.disconnect();
			}
		}, options);
		io.observe(el);
		onCleanup(() => io.disconnect());
	});

	return { inView };
}
