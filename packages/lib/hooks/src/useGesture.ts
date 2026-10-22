import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface GestureDelta {
	/** Horizontal px moved since the drag started */
	x: number;
	/** Vertical px moved since the drag started */
	y: number;
}

export interface GestureState {
	/** True while exactly one pointer is down */
	dragging: Accessor<boolean>;
	/** True while two pointers are down */
	pinching: Accessor<boolean>;
	/** Drag offset from the gesture start — resets when the gesture ends */
	delta: Accessor<GestureDelta>;
	/** Two-pointer distance ratio vs the pinch start — 1 is neutral */
	scale: Accessor<number>;
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Unified pointer gestures on an element — a single pointer reports
 * `dragging` + `delta`, a second pointer switches to `pinching` + `scale`
 * (distance ratio vs the pinch start). Releasing back to one pointer
 * re-anchors the drag; releasing everything resets all state. Pointer-event
 * based; SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @returns `{ dragging, pinching, delta, scale }` accessors
 *
 * @example
 * let zone!: HTMLDivElement;
 * const g = useGesture(() => zone);
 * <div ref={zone} style={{ transform: `translate(${g.delta().x}px, ${g.delta().y}px) scale(${g.scale()})` }} />
 */
export function useGesture(target: MaybeAccessor<HTMLElement | undefined>): GestureState {
	const [dragging, setDragging] = createSignal(false);
	const [pinching, setPinching] = createSignal(false);
	const [delta, setDelta] = createSignal<GestureDelta>({ x: 0, y: 0 });
	const [scale, setScale] = createSignal(1);

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		const pointers = new Map<number, { x: number; y: number }>();
		let dragOrigin = { x: 0, y: 0 };
		let pinchStart = 0;

		const pair = () => {
			const [a, b] = [...pointers.values()];
			return a && b ? ([a, b] as const) : undefined;
		};

		const down = (e: PointerEvent) => {
			pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
			try {
				el.setPointerCapture?.(e.pointerId);
			} catch {
				// jsdom and detached elements may reject capture — drag still works
			}
			if (pointers.size === 1) {
				dragOrigin = { x: e.clientX, y: e.clientY };
				setDelta({ x: 0, y: 0 });
				setDragging(true);
			} else if (pointers.size === 2) {
				const p = pair();
				if (p) pinchStart = distance(p[0], p[1]);
				setPinching(true);
			}
		};

		const move = (e: PointerEvent) => {
			const p = pointers.get(e.pointerId);
			if (!p) return;
			p.x = e.clientX;
			p.y = e.clientY;
			if (pointers.size === 1) {
				setDelta({ x: p.x - dragOrigin.x, y: p.y - dragOrigin.y });
			} else if (pointers.size === 2 && pinchStart > 0) {
				const pts = pair();
				if (pts) setScale(distance(pts[0], pts[1]) / pinchStart);
			}
		};

		const up = (e: PointerEvent) => {
			if (!pointers.delete(e.pointerId)) return;
			if (pointers.size === 0) {
				setDragging(false);
				setPinching(false);
				setDelta({ x: 0, y: 0 });
				setScale(1);
				pinchStart = 0;
			} else if (pointers.size === 1) {
				// Back to a single pointer — re-anchor the drag at its position
				setPinching(false);
				setScale(1);
				pinchStart = 0;
				const [p] = [...pointers.values()];
				if (p) dragOrigin = { x: p.x, y: p.y };
				setDelta({ x: 0, y: 0 });
			}
		};

		el.addEventListener("pointerdown", down as EventListener);
		el.addEventListener("pointermove", move as EventListener);
		el.addEventListener("pointerup", up as EventListener);
		el.addEventListener("pointercancel", up as EventListener);
		onCleanup(() => {
			el.removeEventListener("pointerdown", down as EventListener);
			el.removeEventListener("pointermove", move as EventListener);
			el.removeEventListener("pointerup", up as EventListener);
			el.removeEventListener("pointercancel", up as EventListener);
			pointers.clear();
			setDragging(false);
			setPinching(false);
		});
	});

	return { dragging, pinching, delta, scale };
}
