import { type Accessor, createRenderEffect, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export interface FocusTrapOptions {
	/** Return focus to the previously focused element on deactivate. @default true */
	returnFocus?: boolean;
	/** Focus the first focusable element (or the container) on activate. @default true */
	trapOnActivation?: boolean;
	/** Selector or element that receives the initial focus instead of the first focusable. */
	autoFocus?: string | HTMLElement;
	/** Elements excluded from the tab loop. */
	exclude?: readonly HTMLElement[];
}

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Focusable elements inside `container`, in DOM order — anchors, buttons,
 * inputs, `[tabindex]` (except `-1`) and contenteditable that are visible.
 *
 * @param container — Root element to search
 * @returns Visible focusable elements
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

/** First visible focusable element inside `container`, or undefined. */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | undefined {
	return getFocusableElements(container)[0];
}

/** Last visible focusable element inside `container`, or undefined. */
export function getLastFocusableElement(container: HTMLElement): HTMLElement | undefined {
	const elements = getFocusableElements(container);
	return elements[elements.length - 1];
}

/**
 * Low-level Tab trap for a container — wraps focus from last→first and
 * first→last (Shift+Tab), optionally focusing in on activate and restoring
 * focus on deactivate.
 *
 * @param container — Element that owns the tab loop
 * @param options — See {@link FocusTrapOptions}
 * @returns `{ activate, deactivate }` controls
 */
export function createFocusTrap(
	container: HTMLElement,
	options: FocusTrapOptions = {},
): {
	activate: () => void;
	deactivate: () => void;
} {
	const { returnFocus = true, trapOnActivation = true, autoFocus, exclude = [] } = options;

	let previousActiveElement: HTMLElement | null = null;
	let cleanup: (() => void) | null = null;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Tab") return;

		const focusableElements = getFocusableElements(container).filter((el) => !exclude.includes(el));
		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey) {
			if (document.activeElement === firstElement && lastElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement && firstElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	};

	const activate = () => {
		previousActiveElement = document.activeElement as HTMLElement;
		container.addEventListener("keydown", handleKeyDown);

		if (trapOnActivation) {
			const preferred =
				(typeof autoFocus === "string" ? container.querySelector<HTMLElement>(autoFocus) : autoFocus) ??
				getFirstFocusableElement(container);
			if (preferred) {
				preferred.focus();
			} else {
				container.focus();
			}
		}

		cleanup = () => {
			container.removeEventListener("keydown", handleKeyDown);
		};
	};

	const deactivate = () => {
		if (cleanup) {
			cleanup();
			cleanup = null;
		}

		if (returnFocus && previousActiveElement !== document.body && previousActiveElement?.isConnected) {
			previousActiveElement.focus();
		}
		previousActiveElement = null;
	};

	return { activate, deactivate };
}

/**
 * Bind a focus trap to an element — activates while `active` is truthy and
 * deactivates on cleanup. `active` may be a boolean or an accessor for
 * reactive open/closed state.
 *
 * @param element — Container element (skip the call or pass undefined when absent)
 * @param active — Boolean or `Accessor<boolean>` gating the trap
 * @param options — See {@link FocusTrapOptions}
 * @returns The trap controls, or null without an element
 *
 * @example
 * const trap = useFocusTrap(panel, open); // reactive: activate/deactivate with open()
 */
export function useFocusTrap(
	element: HTMLElement | undefined,
	active: MaybeAccessor<boolean>,
	options?: FocusTrapOptions,
) {
	const trap = element ? createFocusTrap(element, options) : null;
	if (!trap) return null;

	createRenderEffect(() => {
		if (!read(active)) return;
		trap.activate();
		onCleanup(() => trap.deactivate());
	});

	return trap;
}
