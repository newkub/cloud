import { type Accessor, createEffect, onCleanup } from "solid-js";

/** Events that count as an "outside" interaction. */
export type ClickOutsideEvent = PointerEvent | TouchEvent;

/**
 * Call `handler` when a press lands outside the referenced element — covers
 * `pointerdown` plus `touchstart` for older mobile browsers. Pass `enabled`
 * to bind only while open — no `if (open())` inside the handler.
 * No-op during SSR/prerender.
 *
 * @param target — Accessor for the element to contain the click
 * @param handler — Called with the outside `PointerEvent | TouchEvent`
 * @param options — `enabled` accessor gates the listener without unmounting;
 *   `events` overrides the listener list. @default ["pointerdown", "touchstart"]
 *
 * @example
 * let ref!: HTMLDivElement;
 * useClickOutside(() => ref, () => close(), { enabled: open });
 * <div ref={ref}>…</div>
 */
export function useClickOutside(
	target: Accessor<HTMLElement | undefined>,
	handler: (e: ClickOutsideEvent) => void,
	options?: {
		/** Accessor gating the listener without unmounting. @default true */
		enabled?: Accessor<boolean>;
		/** Event types that count as outside presses. @default ["pointerdown", "touchstart"] */
		events?: readonly ("pointerdown" | "touchstart" | "mousedown")[];
	},
) {
	const onDown = (e: ClickOutsideEvent) => {
		const el = target();
		if (el && e.target instanceof Node && !el.contains(e.target)) handler(e);
	};
	createEffect(() => {
		if (typeof document === "undefined" || !(options?.enabled?.() ?? true)) return;
		const events = options?.events ?? ["pointerdown", "touchstart"];
		const listener = onDown as EventListener;
		for (const type of events) document.addEventListener(type, listener, true);
		onCleanup(() => {
			for (const type of events) document.removeEventListener(type, listener, true);
		});
	});
}
