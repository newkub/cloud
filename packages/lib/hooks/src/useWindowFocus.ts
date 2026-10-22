import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface WindowFocusState {
	/** True while the window has focus — tracks `focus`/`blur` events */
	focused: Accessor<boolean>;
}

/**
 * Reactive window focus state — starts from `document.hasFocus()` and follows
 * the window's `focus`/`blur` events.
 *
 * @param options — `onChange` fires after every focus change
 * @returns `{ focused }`
 *
 * @example
 * const { focused } = useWindowFocus();
 * <Show when={!focused()}>paused — tab not focused</Show>
 */
export function useWindowFocus(options?: { onChange?: (focused: boolean) => void }): WindowFocusState {
	const [focused, setFocused] = createSignal(typeof document !== "undefined" ? document.hasFocus() : true);

	onMount(() => {
		const onFocus = () => {
			setFocused(true);
			options?.onChange?.(true);
		};
		const onBlur = () => {
			setFocused(false);
			options?.onChange?.(false);
		};
		window.addEventListener("focus", onFocus);
		window.addEventListener("blur", onBlur);
		onCleanup(() => {
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
		});
	});

	return { focused };
}
