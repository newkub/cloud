/**
 * useFocusTrap - SolidJS composable for focus trap (Functional style)
 * Ensures keyboard navigation stays within the command palette
 */

import { onCleanup, onMount } from "solid-js";

export interface FocusTrapOptions {
	readonly autoFocus?: boolean;
	readonly returnFocus?: boolean;
	readonly clickOutsideDeactivates?: boolean;
	readonly escapeDeactivates?: boolean;
}

const FOCUSABLE_SELECTORS = [
	"a[href]",
	"button:not([disabled])",
	"textarea:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"[tabindex]:not([tabindex='-1'])",
].join(", ");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
	const elements = getFocusableElements(container);
	return elements.length > 0 ? elements[0] : null;
}

function focusFirstFocusable(container: HTMLElement, autoFocus: boolean) {
	if (!autoFocus) return;
	const firstElement = getFirstFocusableElement(container);
	if (firstElement) {
		firstElement.focus();
	}
}

function handleTabNavigation(event: KeyboardEvent, focusableElements: HTMLElement[]) {
	if (focusableElements.length === 0) return;
	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];
	if (!firstElement || !lastElement) return;

	if (event.shiftKey) {
		// Shift + Tab: move to previous element
		if (document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		}
	} else {
		// Tab: move to next element
		if (document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	}
}

function createKeyDownHandler(containerRef: () => HTMLElement | undefined, escapeDeactivates: boolean) {
	return (event: KeyboardEvent) => {
		const container = containerRef();
		if (!container) return;

		if (event.key === "Tab") {
			handleTabNavigation(event, getFocusableElements(container));
		} else if (event.key === "Escape" && escapeDeactivates) {
			// Let the parent component handle escape
			// This is just for focus trap, not for closing
		}
	};
}

function createClickOutsideHandler(containerRef: () => HTMLElement | undefined, clickOutsideDeactivates: boolean) {
	return (event: MouseEvent) => {
		if (!clickOutsideDeactivates) return;

		const container = containerRef();
		if (!container) return;

		if (!container.contains(event.target as Node)) {
			// Let the parent component handle click outside
			// This is just for focus trap, not for closing
		}
	};
}

export function useFocusTrap(containerRef: () => HTMLElement | undefined, options: FocusTrapOptions = {}) {
	const { autoFocus = true, returnFocus = true, clickOutsideDeactivates = true, escapeDeactivates = true } = options;

	let previousActiveElement: HTMLElement | null = null;

	const handleKeyDown = createKeyDownHandler(containerRef, escapeDeactivates);
	const handleClickOutside = createClickOutsideHandler(containerRef, clickOutsideDeactivates);

	const activate = () => {
		const container = containerRef();
		if (!container) return;

		// Store previous active element for return focus
		if (returnFocus && document.activeElement instanceof HTMLElement) {
			previousActiveElement = document.activeElement;
		}

		focusFirstFocusable(container, autoFocus);

		// Add event listeners
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("click", handleClickOutside);
	};

	const deactivate = () => {
		// Remove event listeners
		document.removeEventListener("keydown", handleKeyDown);
		document.removeEventListener("click", handleClickOutside);

		// Return focus to previous element
		if (returnFocus && previousActiveElement) {
			previousActiveElement.focus();
			previousActiveElement = null;
		}
	};

	onMount(() => {
		activate();
	});

	onCleanup(() => {
		deactivate();
	});

	return {
		activate,
		deactivate,
	};
}
