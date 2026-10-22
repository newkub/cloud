import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface PointerPosition {
	x: Accessor<number>;
	y: Accessor<number>;
	/** Bitmask of pressed buttons (PointerEvent.buttons — 1 left, 2 right, 4 middle) */
	buttons: Accessor<number>;
	/** Normalized contact pressure 0–1 (0.5 for an active mouse button, 0 for hover) */
	pressure: Accessor<number>;
	/** Pointer kind: "mouse" | "pen" | "touch" ("" until the first event) */
	pointerType: Accessor<string>;
}

/**
 * Reactive pointer state on window — `x`/`y` update on `pointermove` and
 * `buttons`/`pressure`/`pointerType` also track `pointerdown`/`pointerup`.
 *
 * @returns `{ x, y, buttons, pressure, pointerType }` accessors
 *
 * @example
 * const p = usePointer();
 * <div style={{ transform: `translate(${p.x()}px, ${p.y()}px)` }} />
 */
export function usePointer(): PointerPosition {
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [buttons, setButtons] = createSignal(0);
	const [pressure, setPressure] = createSignal(0);
	const [pointerType, setPointerType] = createSignal("");

	onMount(() => {
		const update = (e: PointerEvent) => {
			setX(e.clientX);
			setY(e.clientY);
			setButtons(e.buttons);
			setPressure(e.pressure);
			setPointerType(e.pointerType);
		};
		window.addEventListener("pointermove", update, { passive: true });
		window.addEventListener("pointerdown", update, { passive: true });
		window.addEventListener("pointerup", update, { passive: true });
		onCleanup(() => {
			window.removeEventListener("pointermove", update);
			window.removeEventListener("pointerdown", update);
			window.removeEventListener("pointerup", update);
		});
	});

	return { x, y, buttons, pressure, pointerType };
}
