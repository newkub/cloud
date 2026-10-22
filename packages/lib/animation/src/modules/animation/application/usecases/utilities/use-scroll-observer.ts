import { createScrollObserver, disconnectScrollObserver, observeScroll } from "../../../../../adapters/browser/index";
import type { ScrollObserverCallbacks, ScrollObserverState } from "../../../../../shared/types/index";

/**
 * Use case: Create scroll-linked animations
 */
export function createScrollObserverFactory() {
	return function createScrollObserverState(callbacks: ScrollObserverCallbacks = {}): ScrollObserverState {
		return createScrollObserver(callbacks);
	};
}

export function createScrollObserverActions() {
	return {
		observeScroll,
		disconnectScrollObserver,
	};
}
