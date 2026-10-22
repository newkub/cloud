import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ScrollPosition {
	/** Vertical scroll offset in px */
	y: () => number;
	/** Horizontal scroll offset in px */
	x: () => number;
	/** Scroll direction since the last event */
	direction: () => "up" | "down" | "none";
	/** True while scroll events are arriving (settles ~150ms after the last one) */
	isScrolling: () => boolean;
	/** True once scrolled past `offset` */
	past: (offset: number) => boolean;
}

const SCROLL_IDLE_MS = 150;

/**
 * Reactive scroll position and direction — window by default, or an element
 * when `target` is passed (reads `scrollTop`/`scrollLeft`). `isScrolling()`
 * is a debounced flag that flips true on each scroll event and settles
 * ~150ms after the last one.
 *
 * @param target — Optional accessor for a scrollable element (defaults to window)
 * @returns `{ x, y, direction, isScrolling, past }` accessors + `past(offset)` helper
 *
 * @example
 * const scroll = useScrollPosition();
 * <header class={scroll.past(80) ? "shadow" : ""}>
 * const list = useScrollPosition(() => listEl());
 */
export function useScrollPosition(target?: Accessor<HTMLElement | undefined>): ScrollPosition {
	const [y, setY] = createSignal(0);
	const [x, setX] = createSignal(0);
	const [direction, setDirection] = createSignal<"up" | "down" | "none">("none");
	const [isScrolling, setIsScrolling] = createSignal(false);
	let lastY = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = target?.();
		const src: HTMLElement | Window = el ?? window;
		const read = () => {
			const next = el ? el.scrollTop : window.scrollY;
			setDirection(next > lastY ? "down" : next < lastY ? "up" : "none");
			lastY = next;
			setY(next);
			setX(el ? el.scrollLeft : window.scrollX);
		};
		const onScroll = () => {
			read();
			setIsScrolling(true);
			clearTimeout(timer);
			timer = setTimeout(() => setIsScrolling(false), SCROLL_IDLE_MS);
		};
		read();
		src.addEventListener("scroll", onScroll, { passive: true });
		onCleanup(() => {
			src.removeEventListener("scroll", onScroll);
			clearTimeout(timer);
			setIsScrolling(false);
		});
	});

	return { y, x, direction, isScrolling, past: (offset: number) => y() > offset };
}
