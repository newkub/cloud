import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface MouseInElement {
	/** Pointer x relative to the element's top-left corner */
	x: Accessor<number>;
	/** Pointer y relative to the element's top-left corner */
	y: Accessor<number>;
	/** True while the pointer is inside the element bounds */
	inside: Accessor<boolean>;
}

/**
 * Element-relative pointer position — listens on window `pointermove` and
 * computes `x`/`y` against the element's bounding rect, so hover state is
 * tracked even when the pointer enters between frames. Rebinds when the
 * target changes. SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @returns `{ x, y, inside }` accessors
 *
 * @example
 * let pad!: HTMLDivElement;
 * const m = useMouseInElement(() => pad);
 * <div ref={pad}>{m.inside() ? `${m.x()},${m.y()}` : "outside"}</div>
 */
export function useMouseInElement(target: MaybeAccessor<HTMLElement | undefined>): MouseInElement {
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [inside, setInside] = createSignal(false);

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		const onMove = (e: PointerEvent) => {
			const rect = el.getBoundingClientRect();
			const relX = e.clientX - rect.left;
			const relY = e.clientY - rect.top;
			setX(relX);
			setY(relY);
			setInside(relX >= 0 && relY >= 0 && relX <= rect.width && relY <= rect.height);
		};

		const onLeave = () => setInside(false);

		window.addEventListener("pointermove", onMove, { passive: true });
		el.addEventListener("pointerleave", onLeave, { passive: true });
		onCleanup(() => {
			window.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerleave", onLeave);
			setInside(false);
		});
	});

	return { x, y, inside };
}
