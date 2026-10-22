import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface DragState {
	/** True between pointerdown and pointerup/cancel */
	dragging: Accessor<boolean>;
	/** Current pointer clientX */
	x: Accessor<number>;
	/** Current pointer clientY */
	y: Accessor<number>;
	/** Horizontal distance from the drag start */
	dx: Accessor<number>;
	/** Vertical distance from the drag start */
	dy: Accessor<number>;
}

/**
 * Pointer-based drag tracking — captures the pointer on `pointerdown`, then
 * reports live `x`/`y` and `dx`/`dy` offsets until release. Rebinds when the
 * target changes. SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param options — Lifecycle callbacks: `onStart`, `onMove`, `onEnd`
 * @returns `{ dragging, x, y, dx, dy }` accessors
 *
 * @example
 * let pad!: HTMLDivElement;
 * const drag = useDrag(() => pad);
 * <div ref={pad} style={{ transform: `translate(${drag.dx()}px, ${drag.dy()}px)` }} />
 */
export function useDrag(
	target: MaybeAccessor<HTMLElement | undefined>,
	options?: {
		/** Fired on pointerdown when the drag begins. */
		onStart?: (e: PointerEvent) => void;
		/** Fired on each pointermove while dragging. */
		onMove?: (e: PointerEvent) => void;
		/** Fired on pointerup/pointercancel with the final event. */
		onEnd?: (e: PointerEvent) => void;
	},
): DragState {
	const [dragging, setDragging] = createSignal(false);
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [dx, setDx] = createSignal(0);
	const [dy, setDy] = createSignal(0);

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let startX = 0;
		let startY = 0;
		let pointerId = -1;

		const onDown = (e: PointerEvent) => {
			if (dragging()) return;
			pointerId = e.pointerId;
			startX = e.clientX;
			startY = e.clientY;
			setX(e.clientX);
			setY(e.clientY);
			setDx(0);
			setDy(0);
			setDragging(true);
			el.setPointerCapture?.(e.pointerId);
			options?.onStart?.(e);
		};

		const onMove = (e: PointerEvent) => {
			if (!dragging() || e.pointerId !== pointerId) return;
			setX(e.clientX);
			setY(e.clientY);
			setDx(e.clientX - startX);
			setDy(e.clientY - startY);
			options?.onMove?.(e);
		};

		const onUp = (e: PointerEvent) => {
			if (!dragging() || e.pointerId !== pointerId) return;
			pointerId = -1;
			setDragging(false);
			options?.onEnd?.(e);
		};

		el.addEventListener("pointerdown", onDown);
		el.addEventListener("pointermove", onMove, { passive: true });
		el.addEventListener("pointerup", onUp);
		el.addEventListener("pointercancel", onUp);
		onCleanup(() => {
			el.removeEventListener("pointerdown", onDown);
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerup", onUp);
			el.removeEventListener("pointercancel", onUp);
			setDragging(false);
		});
	});

	return { dragging, x, y, dx, dy };
}
