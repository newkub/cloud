import { type Accessor, createEffect, onCleanup, onMount } from "solid-js";

/**
 * Inject a reactive `<style>` tag into `<head>` — the text content tracks
 * `css()` and the element is removed on cleanup. No-op during SSR.
 *
 * @param css — Accessor for the stylesheet text
 *
 * @example
 * useStyleSheet(() => `.accent { color: ${color()}; }`);
 */
export function useStyleSheet(css: Accessor<string>) {
	if (typeof document === "undefined") return;
	const tag = document.createElement("style");
	tag.setAttribute("data-use-stylesheet", "");

	createEffect(() => {
		tag.textContent = css();
	});

	onMount(() => {
		document.head.appendChild(tag);
		onCleanup(() => tag.remove());
	});
}
