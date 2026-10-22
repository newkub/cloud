import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface CursorState {
	/** Horizontal position (clientX) of the last pointer event */
	x: Accessor<number>;
	/** Vertical position (clientY) of the last pointer event */
	y: Accessor<number>;
	/** True while the pointer is over the window */
	inside: Accessor<boolean>;
	/** `pointerType` of the last event — "mouse" | "touch" | "pen" */
	type: Accessor<string | undefined>;
}

/**
 * Global cursor position — tracks `pointermove`/`pointerdown` for x/y and
 * pointer type, plus `pointerover`/`pointerout` for whether the pointer is
 * inside the window. SSR-safe: all signals start at their defaults.
 *
 * @returns `{ x, y, inside, type }` accessors
 *
 * @example
 * const cursor = useCursor();
 * <Show when={cursor.inside()}>{cursor.x()}, {cursor.y()} ({cursor.type()})</Show>
 */
export function useCursor(): CursorState {
	const [x, setX] = createSignal(0);
	const [y, setY] = createSignal(0);
	const [inside, setInside] = createSignal(false);
	const [type, setType] = createSignal<string>();

	onMount(() => {
		const move = (e: PointerEvent) => {
			setX(e.clientX);
			setY(e.clientY);
			setType(e.pointerType);
			setInside(true);
		};
		const over = (e: PointerEvent) => {
			setType(e.pointerType);
			setInside(true);
		};
		const out = (e: PointerEvent) => {
			// relatedTarget is null when the pointer leaves the window entirely.
			if (e.relatedTarget === null) setInside(false);
		};

		window.addEventListener("pointermove", move, { passive: true });
		window.addEventListener("pointerdown", move, { passive: true });
		document.documentElement.addEventListener("pointerover", over, { passive: true });
		document.documentElement.addEventListener("pointerout", out, { passive: true });
		onCleanup(() => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerdown", move);
			document.documentElement.removeEventListener("pointerover", over);
			document.documentElement.removeEventListener("pointerout", out);
		});
	});

	return { x, y, inside, type };
}
