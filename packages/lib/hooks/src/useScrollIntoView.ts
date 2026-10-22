import type { Accessor } from "solid-js";

/**
 * Returns a trigger that scrolls `ref()` into view — call it from an event
 * handler. Defaults are `behavior: "smooth"`, `block: "start"`,
 * `inline: "nearest"`; pass per-call overrides to the trigger. SSR-safe:
 * the trigger no-ops without an element.
 *
 * @param ref — Accessor for the element to reveal
 * @param options — Default `ScrollIntoViewOptions` (merged under per-call overrides)
 * @returns `(overrides?: ScrollIntoViewOptions) => void` — call to scroll into view
 *
 * @example
 * let row!: HTMLLIElement;
 * const reveal = useScrollIntoView(() => row, { block: "center" });
 * <button onClick={() => reveal({ behavior: "instant" })}>jump</button>
 */
export function useScrollIntoView(
	ref: Accessor<HTMLElement | undefined>,
	options?: ScrollIntoViewOptions,
): (overrides?: ScrollIntoViewOptions) => void {
	return (overrides) =>
		ref()?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest", ...options, ...overrides });
}
