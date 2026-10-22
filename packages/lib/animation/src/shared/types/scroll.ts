/**
 * Scroll Observer types
 */

export type ScrollObserverMode = "enter" | "leave" | "progress" | "all";

export interface ScrollObserverOptions {
	mode?: ScrollObserverMode;
	root?: string | HTMLElement;
	rootMargin?: string;
	target?: string | HTMLElement;
	threshold?: number | number[];
}

export interface ScrollObserverCallbacks {
	onEnter?: (entry: IntersectionObserverEntry) => void;
	onLeave?: (entry: IntersectionObserverEntry) => void;
	onProgress?: (progress: number) => void;
}

export interface ScrollObserverState {
	observer: IntersectionObserver | null;
	callbacks: ScrollObserverCallbacks;
	target: HTMLElement | null;
	mode: ScrollObserverMode;
	isObserving: boolean;
	progress: number;
}
