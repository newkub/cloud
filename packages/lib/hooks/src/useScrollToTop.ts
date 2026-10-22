import type { Accessor } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";
import { useScrollPosition } from "./useScrollPosition";

export interface ScrollToTopOptions {
	/** Scroll offset in px before `visible()` flips true. @default 300 */
	offset?: number;
	/** Scrollable element or accessor — defaults to window */
	target?: MaybeAccessor<HTMLElement | undefined>;
	/** Scroll behavior for `scrollTop()`. @default "smooth" */
	behavior?: ScrollBehavior;
}

export interface ScrollToTopControls {
	/** True once scrolled past `offset` */
	visible: Accessor<boolean>;
	/** Smooth-scroll the target (or window) back to the top */
	scrollTop: () => void;
}

/**
 * Back-to-top control — composes {@link useScrollPosition} so `visible()`
 * flips once the window (or `target` element) is scrolled past `offset`,
 * and `scrollTop()` scrolls back with `behavior` (smooth by default).
 *
 * @param options — `offset`, `target`, `behavior`
 * @returns `{ visible, scrollTop }`
 *
 * @example
 * const top = useScrollToTop({ offset: 400 });
 * <Show when={top.visible()}><button onClick={top.scrollTop}>↑ top</button></Show>
 */
export function useScrollToTop(options?: ScrollToTopOptions): ScrollToTopControls {
	const offset = options?.offset ?? 300;
	const scroll = useScrollPosition(() => (typeof options?.target === "function" ? options.target() : options?.target));

	const scrollTop = () => {
		const behavior = options?.behavior ?? "smooth";
		const el = typeof options?.target === "function" ? options.target() : options?.target;
		if (el) {
			el.scrollTo({ top: 0, behavior });
			return;
		}
		if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior });
	};

	return { visible: () => scroll.past(offset), scrollTop };
}
