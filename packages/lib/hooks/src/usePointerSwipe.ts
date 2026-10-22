import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export type PointerSwipeDirection = "up" | "down" | "left" | "right" | null;

export interface PointerSwipeState {
	/** Swipe direction once the dominant axis passes `threshold`, else null */
	dir: Accessor<PointerSwipeDirection>;
	/** Horizontal offset in px from pointer down */
	dx: Accessor<number>;
	/** Vertical offset in px from pointer down */
	dy: Accessor<number>;
	/** True between pointerdown and pointerup */
	isSwiping: Accessor<boolean>;
}

export interface PointerSwipeOptions {
	/** Distance in px before `dir` resolves. @default 50 */
	threshold?: number;
	onSwipeStart?: (e: PointerEvent) => void;
	onSwipe?: (state: { dir: PointerSwipeDirection; dx: number; dy: number }) => void;
	onSwipeEnd?: (dir: PointerSwipeDirection, e: PointerEvent) => void;
}

/**
 * Touch-and-mouse swipe detection on one element using pointer events (works
 * with a mouse drag, unlike `useSwipe`). Reads the live offset from the
 * pointer-down origin and resolves the dominant direction once `threshold` is
 * crossed. Passive move listener; SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param options — `threshold` and `onSwipeStart` / `onSwipe` / `onSwipeEnd`
 * @returns `{ dir, dx, dy, isSwiping }` accessors
 *
 * @example
 * let card!: HTMLDivElement;
 * const swipe = usePointerSwipe(() => card, { onSwipeEnd: (dir) => dir === "left" && remove() });
 * <div ref={card}>{swipe().dx.toFixed(0)}px</div>
 */
export function usePointerSwipe(
	target: MaybeAccessor<HTMLElement | undefined>,
	options?: PointerSwipeOptions,
): PointerSwipeState {
	const threshold = options?.threshold ?? 50;
	const [dir, setDir] = createSignal<PointerSwipeDirection>(null);
	const [dx, setDx] = createSignal(0);
	const [dy, setDy] = createSignal(0);
	const [isSwiping, setIsSwiping] = createSignal(false);

	onMount(() => {
		const el = typeof target === "function" ? target() : target;
		if (!el || typeof window === "undefined") return;

		let startX = 0;
		let startY = 0;

		const resolveDir = (x: number, y: number): PointerSwipeDirection => {
			if (Math.abs(x) < threshold && Math.abs(y) < threshold) return null;
			return Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : y > 0 ? "down" : "up";
		};

		const onPointerDown = (e: PointerEvent) => {
			startX = e.clientX;
			startY = e.clientY;
			setIsSwiping(true);
			setDir(null);
			setDx(0);
			setDy(0);
			options?.onSwipeStart?.(e);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!isSwiping()) return;
			const nextDx = e.clientX - startX;
			const nextDy = e.clientY - startY;
			setDx(nextDx);
			setDy(nextDy);
			const next = resolveDir(nextDx, nextDy);
			setDir(next);
			options?.onSwipe?.({ dir: next, dx: nextDx, dy: nextDy });
		};

		const onPointerUp = (e: PointerEvent) => {
			if (!isSwiping()) return;
			setIsSwiping(false);
			options?.onSwipeEnd?.(dir(), e);
		};

		el.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointercancel", onPointerUp);
		onCleanup(() => {
			el.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
		});
	});

	return { dir, dx, dy, isSwiping };
}
