import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface MousePressedState {
	/** True while any pointer is down */
	pressed: Accessor<boolean>;
	/** Which button is currently pressed, or null */
	sourceType: Accessor<"primary" | "secondary" | "auxiliary" | null>;
}

/**
 * Tracks whether the mouse (or any pointer) is currently pressed, globally or
 * on a specific element. Resolves the active button as `sourceType` and resets
 * on pointerup and window blur. SSR-safe.
 *
 * @param target — Element to scope detection to; omit for the whole window
 * @returns `{ pressed, sourceType }` accessors
 *
 * @example
 * const pressed = useMousePressed();
 * <div class={pressed.pressed() ? "scale-95" : ""}>press me</div>
 */
export function useMousePressed(target?: HTMLElement): MousePressedState {
	const [pressed, setPressed] = createSignal(false);
	const [sourceType, setSourceType] = createSignal<"primary" | "secondary" | "auxiliary" | null>(null);

	const buttonType = (button: number) =>
		button === 2 ? ("secondary" as const) : button === 1 ? ("auxiliary" as const) : ("primary" as const);

	onMount(() => {
		const node: Window | HTMLElement = target ?? window;
		const onDown = (e: PointerEvent) => {
			setPressed(true);
			setSourceType(buttonType(e.button));
		};
		const onUp = () => {
			setPressed(false);
			setSourceType(null);
		};
		const onBlur = onUp;
		// the Window|HTMLElement union erases the "pointerdown" overload
		const downHandler = onDown as EventListener;

		node.addEventListener("pointerdown", downHandler);
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("blur", onBlur);
		onCleanup(() => {
			node.removeEventListener("pointerdown", downHandler);
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("blur", onBlur);
		});
	});

	return { pressed, sourceType };
}
