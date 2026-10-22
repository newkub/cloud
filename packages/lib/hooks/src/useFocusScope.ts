import { onCleanup, onMount } from "solid-js";
import { createFocusTrap, getFirstFocusableElement } from "./useFocusTrap";

export interface FocusScopeOptions {
	/** Move focus into the scope on mount. @default true */
	autoFocus?: boolean;
	/** Selector (or element) that receives the initial focus instead of the first focusable. */
	initialFocus?: string | HTMLElement;
	/** Restore focus to the previously focused element on cleanup. @default true */
	restoreFocus?: boolean;
	/** Trap Tab/Shift+Tab inside the scope. @default true */
	trap?: boolean;
	/** Pull focus back into the scope whenever it lands outside (focusin containment). @default false */
	contain?: boolean;
	/** Called when Escape is pressed inside the scope. */
	onEscape?: (event: KeyboardEvent) => void;
	/** Elements excluded from the tab loop. */
	exclude?: readonly HTMLElement[];
}

/**
 * Shared focus scope for overlays — traps Tab inside, focuses an initial
 * element on mount, restores the trigger's focus on unmount, and reports
 * Escape presses. Used by Dialog/Drawer/Popover internals; usable directly.
 *
 * @param ref — Accessor for the scope root element
 * @param options — See {@link FocusScopeOptions}
 *
 * @example
 * let panel!: HTMLDivElement;
 * useFocusScope(() => panel, { onEscape: () => close() });
 */
export function useFocusScope(ref: () => HTMLElement | undefined, options: FocusScopeOptions = {}) {
	const {
		autoFocus = true,
		initialFocus,
		restoreFocus = true,
		trap = true,
		contain = false,
		onEscape,
		exclude = [],
	} = options;
	let previousActiveElement: HTMLElement | null = null;

	onMount(() => {
		const el = ref();
		if (!el) return;
		previousActiveElement = document.activeElement as HTMLElement;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onEscape?.(e);
		};
		el.addEventListener("keydown", onKeyDown);

		const focusTrap = trap
			? createFocusTrap(el, { returnFocus: restoreFocus, trapOnActivation: false, exclude })
			: null;
		focusTrap?.activate();

		// Containment: any focus that lands outside the scope is pulled back in.
		const onFocusIn = (e: FocusEvent) => {
			if (e.target instanceof Node && !el.contains(e.target)) {
				(getFirstFocusableElement(el) ?? el).focus();
			}
		};
		if (contain) document.addEventListener("focusin", onFocusIn);

		if (autoFocus) {
			const target =
				(typeof initialFocus === "string" ? el.querySelector<HTMLElement>(initialFocus) : initialFocus) ??
				getFirstFocusableElement(el) ??
				el;
			target.focus();
		}

		onCleanup(() => {
			el.removeEventListener("keydown", onKeyDown);
			if (contain) document.removeEventListener("focusin", onFocusIn);
			focusTrap?.deactivate();
			if (!focusTrap && restoreFocus && previousActiveElement !== document.body && previousActiveElement?.isConnected)
				previousActiveElement.focus();
		});
	});
}
