import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * `document.activeElement` as a signal — tracks `focusin`/`focusout` (read on
 * the next frame, since `activeElement` updates after `focusout`) and window
 * `blur`. `null` before mount and when nothing is focused.
 *
 * @returns Accessor for the focused element (or `null`)
 *
 * @example
 * const active = useActiveElement();
 * <p>{active()?.tagName.toLowerCase() ?? "nothing focused"}</p>
 */
export function useActiveElement(): Accessor<Element | null> {
	const [active, setActive] = createSignal<Element | null>(null);

	onMount(() => {
		const read = () => setActive(document.activeElement);
		// focusout fires before activeElement moves — defer the read a frame.
		const deferred = () => requestAnimationFrame(read);
		read();
		document.addEventListener("focusin", read);
		document.addEventListener("focusout", deferred);
		window.addEventListener("blur", read);
		onCleanup(() => {
			document.removeEventListener("focusin", read);
			document.removeEventListener("focusout", deferred);
			window.removeEventListener("blur", read);
		});
	});

	return active;
}
