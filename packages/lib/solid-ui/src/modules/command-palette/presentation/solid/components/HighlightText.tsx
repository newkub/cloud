/**
 * HighlightText - render highlighted search query as JSX without innerHTML
 */

import { createMemo, For } from "solid-js";

interface HighlightTextProps {
	text: string;
	query: string;
	highlightClass?: string;
}

interface TextPart {
	text: string;
	highlight: boolean;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitByQuery = (text: string, query: string): readonly TextPart[] => {
	if (!query) return [{ text, highlight: false }];

	const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
	const matches = [...text.matchAll(regex)];
	if (matches.length === 0) return [{ text, highlight: false }];

	const parts: TextPart[] = [];
	let lastIndex = 0;

	for (const match of matches) {
		const index = match.index ?? 0;
		if (index > lastIndex) {
			parts.push({ text: text.slice(lastIndex, index), highlight: false });
		}
		parts.push({ text: match[1] ?? match[0], highlight: true });
		lastIndex = index + match[0].length;
	}

	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex), highlight: false });
	}

	return parts;
};

export function HighlightText(props: HighlightTextProps) {
	const parts = createMemo(() => splitByQuery(props.text, props.query));

	return (
		<For each={parts()}>
			{(part) => (part.highlight ? <span class={props.highlightClass ?? "highlight"}>{part.text}</span> : part.text)}
		</For>
	);
}
