/**
 * SearchHighlight - renders text with case-insensitive query matches wrapped in <mark>.
 */

import { For, type JSX, splitProps } from "solid-js";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Part {
	text: string;
	match: boolean;
}

export interface SearchHighlightProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Text to render. */
	text: string;
	/** Query to highlight — case-insensitive. Empty queries render plain text. */
	query?: string;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function SearchHighlight(props: SearchHighlightProps) {
	const [local, rest] = splitProps(props, ["class", "text", "query", "unstyled"]);

	const parts = (): Part[] => {
		const q = (local.query ?? "").trim();
		if (!q) return [{ text: local.text, match: false }];
		const re = new RegExp(escapeRegExp(q), "gi");
		const out: Part[] = [];
		let last = 0;
		for (const m of local.text.matchAll(re)) {
			const i = m.index;
			if (i > last) out.push({ text: local.text.slice(last, i), match: false });
			out.push({ text: m[0], match: true });
			last = i + m[0].length;
		}
		if (last < local.text.length) out.push({ text: local.text.slice(last), match: false });
		return out;
	};

	const count = () => parts().filter((p) => p.match).length;
	const className = () =>
		local.unstyled ? (local.class ?? "") : `solidui-search-highlight ${local.class ?? ""}`.trim();

	return (
		<span class={className()} {...rest}>
			<span class="sr-only">
				{count()} {count() === 1 ? "match" : "matches"}
			</span>
			<For each={parts()}>
				{(p) =>
					p.match ? (
						<mark class={local.unstyled ? undefined : "rounded-sm bg-warning/30 px-0.5 text-foreground"}>{p.text}</mark>
					) : (
						p.text
					)
				}
			</For>
		</span>
	);
}
