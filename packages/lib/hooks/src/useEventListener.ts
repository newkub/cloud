import { type Accessor, createEffect, onCleanup } from "solid-js";

export type MaybeAccessor<T> = T | Accessor<T>;

export type EventTargetLike = Window | Document | HTMLElement;

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Bind a DOM event listener with automatic cleanup. Reactive — rebinds when
 * the target accessor or `enabled` flag changes, no manual wiring needed.
 * Accepts a single target, an accessor resolving to one, or an array of
 * targets (undefined entries are skipped).
 * SSR-safe: no-ops when `window` is unavailable.
 *
 * @param target — Target, accessor, or array of targets
 * @param type — Event type (e.g. `"keydown"`, `"resize"`)
 * @param handler — Event handler
 * @param options — AddEventListenerOptions plus `enabled` accessor to gate binding
 *
 * @example
 * useEventListener(window, "resize", () => setWidth(window.innerWidth));
 * useEventListener(() => panelEl(), "keydown", onKey, { enabled: open });
 * useEventListener([btnA, () => btnB()], "click", onClick);
 */
export function useEventListener<E extends Event = Event>(
	target: MaybeAccessor<EventTargetLike | undefined> | readonly MaybeAccessor<EventTargetLike | undefined>[],
	type: keyof WindowEventMap | string,
	handler: (e: E) => void,
	options?: AddEventListenerOptions & { enabled?: Accessor<boolean> },
) {
	createEffect(() => {
		const targets = Array.isArray(target) ? target.map(read) : [read(target)];
		const enabled = options?.enabled?.() ?? true;
		const els = targets.filter((el): el is EventTargetLike => !!el);
		if (!els.length || !enabled || typeof window === "undefined") return;
		const { enabled: _en, ...listenerOptions } = options ?? {};
		const listener = handler as EventListener;
		for (const el of els) el.addEventListener(type, listener, listenerOptions);
		onCleanup(() => {
			for (const el of els) el.removeEventListener(type, listener, listenerOptions);
		});
	});
}
