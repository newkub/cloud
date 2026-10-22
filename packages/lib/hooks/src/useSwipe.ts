import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export type SwipeDirection = "up" | "down" | "left" | "right" | null;

export interface SwipeState {
	/** Dominant direction once `threshold` is exceeded, else null */
	dir: SwipeDirection;
	/** Horizontal offset in px from the touch start */
	dx: number;
	/** Vertical offset in px from the touch start */
	dy: number;
}

const IDLE: SwipeState = { dir: null, dx: 0, dy: 0 };

/**
 * Track a single-finger touch swipe — `dir` resolves once the dominant axis
 * passes `threshold`, `dx`/`dy` report the live offset, and the state resets
 * to idle on touchend/touchcancel. Passive listeners; SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param options — `threshold` in px before `dir` resolves. @default 50
 * @returns Accessor for `{ dir, dx, dy }`
 *
 * @example
 * let zone!: HTMLDivElement;
 * const swipe = useSwipe(() => zone, { threshold: 40 });
 * <div ref={zone}>{swipe().dir ?? "swipe me"}</div>
 */
export function useSwipe(
	target: MaybeAccessor<HTMLElement | undefined>,
	options?: {
		/** Distance in px before the direction resolves. @default 50 */
		threshold?: number;
	},
): Accessor<SwipeState> {
	const threshold = options?.threshold ?? 50;
	const [state, setState] = createSignal<SwipeState>(IDLE);

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let startX = 0;
		let startY = 0;

		const resolve = (dx: number, dy: number): SwipeDirection => {
			if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;
			return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
		};

		const onStart = (e: TouchEvent) => {
			const t = e.touches[0];
			if (!t) return;
			startX = t.clientX;
			startY = t.clientY;
		};

		const onMove = (e: TouchEvent) => {
			const t = e.touches[0];
			if (!t) return;
			const dx = t.clientX - startX;
			const dy = t.clientY - startY;
			setState({ dir: resolve(dx, dy), dx, dy });
		};

		const onEnd = () => setState(IDLE);

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
