import { type Accessor, createEffect, onCleanup } from "solid-js";

export interface MetaTagRef {
	/** `<meta name="…">` key — e.g. `"description"`, `"theme-color"` */
	name?: string;
	/** `<meta property="…">` key — e.g. `"og:title"` (takes precedence) */
	property?: string;
}

/**
 * Keep a `<meta>` tag's `content` in sync with a reactive value. Creates the
 * tag when missing; on cleanup removes a tag it created or restores the
 * previous content of an existing one. No-op during SSR.
 *
 * @param ref — `{ name }` or `{ property }` identifying the meta tag
 * @param content — Accessor for the `content` attribute (`undefined` clears it)
 *
 * @example
 * useMetaTag({ property: "og:title" }, () => page().title);
 * useMetaTag({ name: "theme-color" }, () => theme().color);
 */
export function useMetaTag(ref: MetaTagRef, content: Accessor<string | undefined>) {
	if (typeof document === "undefined") return;
	const attr = ref.property !== undefined ? "property" : "name";
	const key = ref.property ?? ref.name;
	if (!key) return;

	let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}=${JSON.stringify(key)}]`);
	let created = false;
	if (!tag) {
		tag = document.createElement("meta");
		tag.setAttribute(attr, key);
		document.head.appendChild(tag);
		created = true;
	}
	const el = tag;
	const previous = el.getAttribute("content");

	createEffect(() => {
		const v = content();
		if (v === undefined) el.removeAttribute("content");
		else el.setAttribute("content", v);
	});

	onCleanup(() => {
		if (created) el.remove();
		else if (previous === null) el.removeAttribute("content");
		else el.setAttribute("content", previous);
	});
}
