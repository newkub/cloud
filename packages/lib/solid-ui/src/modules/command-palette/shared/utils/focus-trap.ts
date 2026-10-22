/**
 * Focus Trap Utility
 * Traps focus within a container element for accessibility
 */

export interface FocusTrapOptions {
	/**
	 * Whether to return focus to the trigger element when trap is deactivated
	 */
	returnFocus?: boolean;

	/**
	 * Whether to trap focus on activation
	 */
	trapOnActivation?: boolean;

	/**
	 * Elements to exclude from focus trap
	 */
	exclude?: readonly HTMLElement[];
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): readonly HTMLElement[] {
	const focusableSelectors = [
		"a[href]",
		"button:not([disabled])",
		"textarea:not([disabled])",
		"input:not([disabled])",
		"select:not([disabled])",
		"[tabindex]:not([tabindex='-1'])",
		"[contenteditable]",
	].join(", ");

	return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter((el) => {
		const style = window.getComputedStyle(el);
		return style.display !== "none" && style.visibility !== "hidden";
	});
}

/**
 * Get first focusable element
 */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | undefined {
	const elements = getFocusableElements(container);
	return elements[0];
}

/**
 * Get last focusable element
 */
export function getLastFocusableElement(container: HTMLElement): HTMLElement | undefined {
	const elements = getFocusableElements(container);
	return elements[elements.length - 1];
}

/**
 * Create a focus trap instance
 */
export function createFocusTrap(
	container: HTMLElement,
	options: FocusTrapOptions = {},
): {
	activate: () => void;
	deactivate: () => void;
} {
	const { returnFocus = true, trapOnActivation = true, exclude = [] } = options;

	let previousActiveElement: HTMLElement | null = null;
	let cleanup: (() => void) | null = null;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Tab") return;

		const focusableElements = getFocusableElements(container).filter((el) => !exclude.includes(el));

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey) {
			// Shift + Tab: Move to previous element
			if (document.activeElement === firstElement && lastElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			// Tab: Move to next element
			if (document.activeElement === lastElement && firstElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	};

	const activate = () => {
		// Store previously focused element
		previousActiveElement = document.activeElement as HTMLElement;

		// Add keyboard listener
		container.addEventListener("keydown", handleKeyDown);

		// Focus first focusable element if requested
		if (trapOnActivation) {
			const firstElement = getFirstFocusableElement(container);
			if (firstElement) {
				firstElement.focus();
			}
		}

		cleanup = () => {
			container.removeEventListener("keydown", handleKeyDown);
		};
	};

	const deactivate = () => {
		// Remove keyboard listener
		if (cleanup) {
			cleanup();
			cleanup = null;
		}

		// Return focus to previous element if requested
		if (returnFocus && previousActiveElement) {
			previousActiveElement.focus();
		}
	};

	return { activate, deactivate };
}
