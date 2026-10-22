/**
 * TextHighlighter — highlights matched substrings inside text (search-result style).
 */
import { For, type JSX, splitProps } from "solid-js";

export interface TextHighlighterProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	text: string;
	/** Words/phrases to highlight. */
	queries: string[];
	/** Highlight tone — used when `highlightClass` is not set. @default "warning" */
	variant?: "warning" | "primary" | "success" | "info" | "destructive";
	/** Case-sensitive matching. @default false */
	caseSensitive?: boolean;
	/** Highlight class — overrides `variant` when set. */
	highlightClass?: string;
	/** Element wrapping a match. @default "mark" */
	tag?: "mark" | "span" | "strong";
}

function escapeRe(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const markTones = {
	warning: "rounded-sm bg-warning/30 px-0.5 text-foreground",
	primary: "rounded-sm bg-primary/25 px-0.5 text-foreground",
	success: "rounded-sm bg-success/25 px-0.5 text-foreground",
	info: "rounded-sm bg-info/25 px-0.5 text-foreground",
	destructive: "rounded-sm bg-destructive/25 px-0.5 text-foreground",
} as const;

export function TextHighlighter(props: TextHighlighterProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"text",
		"queries",
		"caseSensitive",
		"highlightClass",
		"tag",
		"variant",
	]);
	const parts = () => {
		const qs = (local.queries ?? []).filter(Boolean).map(escapeRe);
		if (!qs.length) return [{ text: local.text ?? "", match: false }];
		const re = new RegExp(`(${qs.join("|")})`, local.caseSensitive ? "g" : "gi");
		return (local.text ?? "").split(re).map((t) => ({ text: t, match: re.test(t) && t !== "" }));
	};
	return (
		<span class={`solidui-text-highlighter ${local.class ?? ""}`.trim()} {...rest}>
			<For each={parts()}>
				{(p) =>
					p.match ? <mark class={local.highlightClass ?? markTones[local.variant ?? "warning"]}>{p.text}</mark> : p.text
				}
			</For>
		</span>
	);
}
