import { type Accessor, createEffect, onCleanup } from "solid-js";

/**
 * Apply the `inert` attribute to an element while `inert()` is true — the
 * subtree becomes unfocusable, unclickable, and hidden from assistive tech.
 * The attribute is removed when `inert()` flips back, `ref()` re-points, or
 * the owner disposes.
 *
 * @param ref — Accessor for the element to make inert
 * @param inert — Accessor deciding whether the element is inert
 *
 * @example
 * let panel!: HTMLDivElement;
 * const [disabled, setDisabled] = createSignal(false);
 * useInert(() => panel, disabled);
 * <div ref={panel}><button>unreachable while inert</button></div>
 */
export function useInert(ref: Accessor<HTMLElement | undefined>, inert: Accessor<boolean>): void {
	createEffect(() => {
		const el = ref();
		if (!el || !inert()) return;
		el.setAttribute("inert", "");
		onCleanup(() => el.removeAttribute("inert"));
	});
}
