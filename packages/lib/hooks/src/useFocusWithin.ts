import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * True while focus is inside the element — listens to the bubbling
 * `focusin`/`focusout` pair and ignores moves between descendants.
 * Rebinds when `ref()` resolves to a different element.
 *
 * @param ref — Accessor for the container element
 * @returns Accessor for the focus-within flag
 *
 * @example
 * let form!: HTMLFormElement;
 * const within = useFocusWithin(() => form);
 * <form ref={form} class={within() ? "ring" : ""}>…</form>
 */
export function useFocusWithin(ref: Accessor<HTMLElement | undefined>): Accessor<boolean> {
	const [within, setWithin] = createSignal(false);

	createEffect(() => {
		const el = ref();
		if (!el) return;
		const onIn = () => setWithin(true);
		const onOut = (e: FocusEvent) => {
			if (!(e.relatedTarget instanceof Node) || !el.contains(e.relatedTarget)) setWithin(false);
		};
		el.addEventListener("focusin", onIn);
		el.addEventListener("focusout", onOut);
		onCleanup(() => {
			el.removeEventListener("focusin", onIn);
			el.removeEventListener("focusout", onOut);
			setWithin(false);
		});
	});

	return within;
}
