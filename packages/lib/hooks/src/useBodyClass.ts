import { type Accessor, createEffect, onCleanup } from "solid-js";

/**
 * Toggle a reactive set of classes on `document.body` — the previous batch is
 * removed whenever `classes()` changes and everything is cleaned up on
 * unmount. No-op during SSR.
 *
 * @param classes — Accessor for a whitespace-separated class list
 *
 * @example
 * useBodyClass(() => (menuOpen() ? "overflow-hidden nav-open" : ""));
 */
export function useBodyClass(classes: Accessor<string>) {
	if (typeof document === "undefined") return;
	createEffect(() => {
		const tokens = classes().split(/\s+/).filter(Boolean);
		if (!tokens.length) return;
		document.body.classList.add(...tokens);
		onCleanup(() => document.body.classList.remove(...tokens));
	});
}
