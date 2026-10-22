import type { ScrollObserverCallbacks, ScrollObserverMode, ScrollObserverOptions } from "../../shared/types/scroll";

/**
 * Scroll Observer infrastructure - Wraps IntersectionObserver for scroll-linked animations (Functional style)
 */

export type ScrollObserverState = Readonly<{
	observer: IntersectionObserver | null;
	callbacks: ScrollObserverCallbacks;
	target: HTMLElement | null;
	mode: ScrollObserverMode;
	isObserving: boolean;
	progress: number;
}>;

export const INITIAL_SCROLL_OBSERVER_STATE: ScrollObserverState = {
	observer: null,
	callbacks: {},
	target: null,
	mode: "all",
	isObserving: false,
	progress: 0,
};

export const createScrollObserver = (callbacks: ScrollObserverCallbacks = {}): ScrollObserverState => ({
	...INITIAL_SCROLL_OBSERVER_STATE,
	callbacks,
});

export const observeScroll = (
	state: ScrollObserverState,
	target: HTMLElement,
	options: ScrollObserverOptions = {},
): ScrollObserverState => {
	const mode = options.mode || "all";

	const observerOptions: IntersectionObserverInit = {
		root: typeof options.root === "string" ? (document.querySelector(options.root) as HTMLElement) : options.root,
		threshold: options.threshold || 0,
		rootMargin: options.rootMargin || "0px",
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				state.callbacks.onEnter?.(entry);
			} else {
				state.callbacks.onLeave?.(entry);
			}
		});
	}, observerOptions);

	observer.observe(target);

	if (mode === "progress" || mode === "all") {
		setupScrollProgress(target, state.callbacks);
	}

	return {
		...state,
		observer,
		target,
		mode,
		isObserving: true,
		progress: 0,
	};
};

const setupScrollProgress = (target: HTMLElement, callbacks: ScrollObserverCallbacks): void => {
	const handleScroll = () => {
		const rect = target.getBoundingClientRect();
		const windowHeight = window.innerHeight;
		const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

		callbacks.onProgress?.(progress);
	};

	window.addEventListener("scroll", handleScroll, { passive: true });
	handleScroll();
};

export const disconnectScrollObserver = (state: ScrollObserverState): ScrollObserverState => {
	if (state.observer) {
		state.observer.disconnect();
	}
	return {
		...state,
		observer: null,
		target: null,
		isObserving: false,
	};
};
