import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export interface DraggableControls {
	/** Current x offset in px */
	x: Accessor<number>;
	/** Current y offset in px */
	y: Accessor<number>;
	/** True while actively dragging */
	isDragging: Accessor<boolean>;
	/** Reposition programmatically (also moves the element) */
	setPosition: (x: number, y: number) => void;
}

/**
 * Makes an element draggable with pointer events. The element is moved by
 * updating its `style.transform` (`translate(x, y)`) unless `moveElement` is
 * disabled, in which case only the signals change. Pointer capture keeps the
 * drag alive outside the element bounds. SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param options — `initialPosition`, `disabled` (accessor ok), `moveElement`
 * @returns `{ x, y, isDragging, setPosition }`
 *
 * @example
 * let card!: HTMLDivElement;
 * const pos = useDraggable(() => card);
 * <div ref={card} class="touch-none cursor-grab">drag ({pos.x()},{pos.y()})</div>
 */
export function useDraggable(
	target: MaybeAccessor<HTMLElement | undefined>,
	options?: {
		initialPosition?: { x: number; y: number };
		disabled?: MaybeAccessor<boolean>;
		/** Apply `translate()` to the element itself. @default true */
		moveElement?: boolean;
	},
): DraggableControls {
	const [x, setX] = createSignal(options?.initialPosition?.x ?? 0);
	const [y, setY] = createSignal(options?.initialPosition?.y ?? 0);
	const [isDragging, setIsDragging] = createSignal(false);
	const moveElement = options?.moveElement !== false;

	const isDisabled = () => {
		const d = options?.disabled;
		return typeof d === "function" ? d() : (d ?? false);
	};

	const apply = (el: HTMLElement) => {
		if (moveElement) el.style.transform = `translate(${x()}px, ${y()}px)`;
	};

	onMount(() => {
		const el = typeof target === "function" ? target() : target;
		if (!el || typeof window === "undefined") return;
		apply(el);

		let startX = 0;
		let startY = 0;
		let originX = 0;
		let originY = 0;

		const onPointerDown = (e: PointerEvent) => {
			if (isDisabled()) return;
			setIsDragging(true);
			startX = e.clientX;
			startY = e.clientY;
			originX = x();
			originY = y();
			el.setPointerCapture(e.pointerId);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!isDragging()) return;
			setX(originX + e.clientX - startX);
			setY(originY + e.clientY - startY);
			apply(el);
		};

		const onPointerUp = (e: PointerEvent) => {
			setIsDragging(false);
			if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
		};

		el.addEventListener("pointerdown", onPointerDown);
		el.addEventListener("pointermove", onPointerMove);
		el.addEventListener("pointerup", onPointerUp);
		el.addEventListener("pointercancel", onPointerUp);
		onCleanup(() => {
			el.removeEventListener("pointerdown", onPointerDown);
			el.removeEventListener("pointermove", onPointerMove);
			el.removeEventListener("pointerup", onPointerUp);
			el.removeEventListener("pointercancel", onPointerUp);
		});
	});

	function setPosition(nextX: number, nextY: number) {
		setX(nextX);
		setY(nextY);
		const el = typeof target === "function" ? target() : target;
		if (el) apply(el);
	}

	return { x, y, isDragging, setPosition };
}
