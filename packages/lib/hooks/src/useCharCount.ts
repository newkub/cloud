import { type Accessor, createMemo } from "solid-js";

export interface CharCount {
	/** Character count in Unicode code points. */
	chars: Accessor<number>;
	/** Word count — whitespace-separated tokens. */
	words: Accessor<number>;
	/** `max - chars` — `undefined` when no `max` was given. */
	remaining: Accessor<number | undefined>;
	/** True when `chars > max` — always false without a `max`. */
	over: Accessor<boolean>;
}

/**
 * Live character/word counters for a text accessor — counts characters in
 * code points (emoji-safe) and words as non-empty whitespace-separated
 * tokens.
 *
 * @param value — Accessor holding the text
 * @param max — Optional character limit driving `remaining`/`over`
 * @returns `{ chars, words, remaining, over }`
 *
 * @example
 * const [text, setText] = createSignal("");
 * const count = useCharCount(text, 280);
 * <span class={count.over() ? "text-destructive" : ""}>{count.remaining()}</span>
 */
export function useCharCount(value: Accessor<string>, max?: number): CharCount {
	const chars = createMemo(() => [...value()].length);
	const words = createMemo(
		() =>
			value()
				.split(/\s+/)
				.filter((w) => w.length > 0).length,
	);
	const remaining = createMemo(() => (max === undefined ? undefined : max - chars()));
	const over = createMemo(() => max !== undefined && chars() > max);
	return { chars, words, remaining, over };
}
