import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * True while a `position: sticky` element is stuck to its offset — works by
 * inserting a zero-height sentinel just before the element and watching it
 * with IntersectionObserver. Re-observes when `ref()` changes; the sentinel
 * is removed on cleanup.
 *
 * @param ref — Accessor for the sticky element
 * @param options — `offsetTop` must match the element's `top` in px so the flag flips exactly at the stick point. @default `{ offsetTop: 0 }`
 * @returns Accessor for the is-stuck flag
 *
 * @example
 * let head!: HTMLDivElement;
 * const stuck = useSticky(() => head);
 * <div ref={head} class="sticky top-0">{stuck() ? "stuck" : "top"}</div>
 */
export function useSticky(
	ref: Accessor<HTMLElement | undefined>,
	options?: {
		/** The element's sticky `top` offset in px. @default 0 */
		offsetTop?: number;
	},
): Accessor<boolean> {
	const [stuck, setStuck] = createSignal(false);

	createEffect(() => {
		const el = ref();
		const parent = el?.parentElement;
		if (!el || !parent || typeof IntersectionObserver === "undefined") return;

		const sentinel = document.createElement("div");
		sentinel.setAttribute("aria-hidden", "true");
		sentinel.style.cssText = "height:0;width:100%;flex-shrink:0;";
		parent.insertBefore(sentinel, el);

		const io = new IntersectionObserver(
			([entry]) => {
				if (entry) setStuck(!entry.isIntersecting);
			},
			{
				rootMargin: `-${(options?.offsetTop ?? 0) + 1}px 0px 0px 0px`,
				threshold: [0],
			},
		);
		io.observe(sentinel);

		onCleanup(() => {
			io.disconnect();
			sentinel.remove();
			setStuck(false);
		});
	});

	return stuck;
}
