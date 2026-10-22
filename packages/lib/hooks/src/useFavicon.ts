import { type Accessor, createEffect, onCleanup } from "solid-js";

/**
 * Swap the document favicon to a reactive URL — restores the previous icon
 * (or removes a tag it created) on cleanup. No-op during SSR.
 *
 * @param href — Accessor for the icon URL
 *
 * @example
 * useFavicon(() => (unread() ? "/favicon-dot.svg" : "/favicon.svg"));
 */
export function useFavicon(href: Accessor<string>) {
	if (typeof document === "undefined") return;
	let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
	let created = false;
	if (!link) {
		link = document.createElement("link");
		link.rel = "icon";
		document.head.appendChild(link);
		created = true;
	}
	const el = link;
	const previous = el.getAttribute("href");

	createEffect(() => {
		el.href = href();
	});

	onCleanup(() => {
		if (created) el.remove();
		else if (previous === null) el.removeAttribute("href");
		else el.setAttribute("href", previous);
	});
}
