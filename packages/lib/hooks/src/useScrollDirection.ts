import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ScrollDirectionState {
	/** Scroll direction since the last scroll event */
	direction: Accessor<"up" | "down" | "none">;
	/** Last observed vertical scroll offset in px */
	lastY: Accessor<number>;
}

/**
 * Track vertical scroll direction — window by default, or an element when
 * `target` is passed (reads `scrollTop`). `direction()` flips to `"up"` or
 * `"down"` on each scroll event and stays until the next one; `lastY()`
 * mirrors the latest offset.
 *
 * @param target — Optional accessor for a scrollable element (defaults to window)
 * @returns `{ direction, lastY }` accessors
 *
 * @example
 * const { direction } = useScrollDirection();
 * <header class={direction() === "down" ? "-translate-y-full" : ""}>
 * const list = useScrollDirection(() => listEl());
 */
export function useScrollDirection(target?: Accessor<HTMLElement | undefined>): ScrollDirectionState {
	const [direction, setDirection] = createSignal<"up" | "down" | "none">("none");
	const [lastY, setLastY] = createSignal(0);

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = target?.();
		const src: HTMLElement | Window = el ?? window;
		let prev = el ? el.scrollTop : window.scrollY;
		setLastY(prev);
		const onScroll = () => {
			const next = el ? el.scrollTop : window.scrollY;
			setDirection(next > prev ? "down" : next < prev ? "up" : "none");
			prev = next;
			setLastY(next);
		};
		src.addEventListener("scroll", onScroll, { passive: true });
		onCleanup(() => {
			src.removeEventListener("scroll", onScroll);
			setDirection("none");
		});
	});

	return { direction, lastY };
}
