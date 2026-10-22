import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface PinchState {
	/** Distance ratio vs the gesture start — 1 is neutral, >1 zoom in */
	scale: number;
	/** Distance change in px since the previous touchmove */
	delta: number;
}

const distance = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

/**
 * Two-finger pinch on an element — `scale` is relative to the gesture start
 * and `delta` is the per-event distance change. Resets to neutral when fewer
 * than two touches remain. Passive listeners; SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @returns Accessor for `{ scale, delta }`
 *
 * @example
 * let zone!: HTMLDivElement;
 * const pinch = usePinch(() => zone);
 * <div ref={zone} style={{ transform: `scale(${pinch().scale})` }} />
 */
export function usePinch(target: MaybeAccessor<HTMLElement | undefined>): Accessor<PinchState> {
	const [state, setState] = createSignal<PinchState>({ scale: 1, delta: 0 });

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let startDistance = 0;
		let prevDistance = 0;

		const onStart = (e: TouchEvent) => {
			if (e.touches.length !== 2) return;
			const a = e.touches[0];
			const b = e.touches[1];
			if (!a || !b) return;
			startDistance = distance(a, b);
			prevDistance = startDistance;
		};

		const onMove = (e: TouchEvent) => {
			if (e.touches.length !== 2 || startDistance === 0) return;
			const a = e.touches[0];
			const b = e.touches[1];
			if (!a || !b) return;
			const d = distance(a, b);
			setState({ scale: d / startDistance, delta: d - prevDistance });
			prevDistance = d;
		};

		const onEnd = (e: TouchEvent) => {
			if (e.touches.length < 2) {
				startDistance = 0;
				setState({ scale: 1, delta: 0 });
			}
		};

		el.addEventListener("touchstart", onStart, { passive: true });
		el.addEventListener("touchmove", onMove, { passive: true });
		el.addEventListener("touchend", onEnd, { passive: true });
		el.addEventListener("touchcancel", onEnd, { passive: true });
		onCleanup(() => {
			el.removeEventListener("touchstart", onStart);
			el.removeEventListener("touchmove", onMove);
			el.removeEventListener("touchend", onEnd);
			el.removeEventListener("touchcancel", onEnd);
		});
	});

	return state;
}
