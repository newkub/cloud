import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface FocusVisibleControls {
	/** True while `document.activeElement` was reached by keyboard — the `:focus-visible` heuristic */
	focusVisible: Accessor<boolean>;
}

/**
 * Mirrors `:focus-visible` globally — `focusVisible()` is true only when the
 * current `document.activeElement` got focused after keyboard input. `keydown`
 * switches to keyboard modality; `mousedown`/`pointerdown`/`touchstart` switch
 * back to pointer modality; `focusout` and window `blur` reset to false.
 *
 * @returns `{ focusVisible }`
 *
 * @example
 * const { focusVisible } = useFocusVisible();
 * <span class={focusVisible() ? "ring" : ""}>…</span>
 */
export function useFocusVisible(): FocusVisibleControls {
	const [focusVisible, setFocusVisible] = createSignal(false);

	onMount(() => {
		if (typeof window === "undefined" || typeof document === "undefined") return;
		let keyboard = false;
		const onKey = () => {
			keyboard = true;
		};
		const onPointer = () => {
			keyboard = false;
		};
		const onFocusIn = () => {
			const el = document.activeElement;
			setFocusVisible(keyboard && !!el && el !== document.body);
		};
		const onFocusOut = () => setFocusVisible(false);
		const onBlur = () => setFocusVisible(false);
		window.addEventListener("keydown", onKey, true);
		window.addEventListener("mousedown", onPointer, true);
		window.addEventListener("pointerdown", onPointer, true);
		window.addEventListener("touchstart", onPointer, true);
		document.addEventListener("focusin", onFocusIn);
		document.addEventListener("focusout", onFocusOut);
		window.addEventListener("blur", onBlur);
		onCleanup(() => {
			window.removeEventListener("keydown", onKey, true);
			window.removeEventListener("mousedown", onPointer, true);
			window.removeEventListener("pointerdown", onPointer, true);
			window.removeEventListener("touchstart", onPointer, true);
			document.removeEventListener("focusin", onFocusIn);
			document.removeEventListener("focusout", onFocusOut);
			window.removeEventListener("blur", onBlur);
		});
	});

	return { focusVisible };
}
