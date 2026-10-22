import { createEffect, onCleanup } from "solid-js";
import type { EventTargetLike, MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as () => T)() : v);

/**
 * Bind a DOM event listener that fires at most once — the handler is removed
 * after the first event, and also on unmount or when the target accessor
 * changes. Accepts a plain target or an accessor resolving to one.
 * SSR-safe: no-ops when `window` is unavailable.
 *
 * @param target — Target or accessor resolving to one
 * @param type — Event type (e.g. `"click"`, `"keydown"`)
 * @param listener — Handler invoked at most once
 * @param options — AddEventListenerOptions (`once` is forced on)
 *
 * @example
 * useEventListenerOnce(window, "click", () => setInteracted(true));
 * useEventListenerOnce(() => dialogEl(), "close", onFirstClose);
 */
export function useEventListenerOnce<E extends Event = Event>(
	target: MaybeAccessor<EventTargetLike | undefined>,
	type: keyof WindowEventMap | string,
	listener: (e: E) => void,
	options?: AddEventListenerOptions,
): void {
	let fired = false;
	createEffect(() => {
		const el = read(target);
		if (!el || fired || typeof window === "undefined") return;
		const once = (e: Event) => {
			if (fired) return;
			fired = true;
			el.removeEventListener(type, once, options);
			listener(e as E);
		};
		el.addEventListener(type, once, { ...options, once: true });
		onCleanup(() => el.removeEventListener(type, once, options));
	});
}
