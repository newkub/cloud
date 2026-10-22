import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface MousePosition {
	/** X relative to the viewport */
	x: Accessor<number>;
	/** Y relative to the viewport */
	y: Accessor<number>;
	/** X including page scroll */
	pageX: Accessor<number>;
	/** Y including page scroll */
	pageY: Accessor<number>;
	/** X relative to the screen */
	screenX: Accessor<number>;
	/** Y relative to the screen */
	screenY: Accessor<number>;
}

/**
 * Reactive global mouse position via `window` `pointermove` — viewport, page
 * and screen coordinates. Stays at zeros on SSR; the listener is removed on
 * cleanup.
 *
 * @returns `{ x, y, pageX, pageY, screenX, screenY }` accessors
 *
 * @example
 * const mouse = useMouse();
 * <span>{mouse.x()}, {mouse.y()}</span>
 */
export function useMouse(): MousePosition {
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [pageX, setPageX] = createSignal(0);
	const [pageY, setPageY] = createSignal(0);
	const [screenX, setScreenX] = createSignal(0);
	const [screenY, setScreenY] = createSignal(0);

	onMount(() => {
		const onMove = (e: PointerEvent) => {
			setX(e.clientX);
			setY(e.clientY);
			setPageX(e.pageX);
			setPageY(e.pageY);
			setScreenX(e.screenX);
			setScreenY(e.screenY);
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		onCleanup(() => window.removeEventListener("pointermove", onMove));
	});

	return { x, y, pageX, pageY, screenX, screenY };
}
