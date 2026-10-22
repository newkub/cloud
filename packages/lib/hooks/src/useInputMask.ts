import { type Accessor, createMemo, createSignal } from "solid-js";

type MaskToken = (char: string) => boolean;

const isDigit = (c: string) => c >= "0" && c <= "9";
const isAlpha = (c: string) => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
const isAlnum = (c: string) => isDigit(c) || isAlpha(c);

/** Mask tokens — every other mask character is a literal inserted verbatim. */
const TOKENS: Record<string, MaskToken> = {
	"9": isDigit,
	"#": isDigit,
	a: isAlpha,
	A: isAlpha,
	"*": isAlnum,
};

export interface InputMaskControls {
	/** Apply the mask to any string — strips unfittable characters, inserts literals. */
	format: (raw: string) => string;
	/** Masked value (what the input shows). */
	value: Accessor<string>;
	/** Characters that filled mask slots — literals stripped (what you'd persist). */
	raw: Accessor<string>;
	/** Set from a raw or partially-masked string. */
	set: (raw: string) => void;
	/** Props to spread on `<input>` — controlled masked `value` + `onInput`. */
	bind: {
		readonly value: string;
		onInput: (e: InputEvent & { currentTarget: HTMLInputElement }) => void;
	};
}

/**
 * Input masking — `format` applies a pattern like `"999-999-9999"` where
 * `9`/`#` = digit, `a`/`A` = letter, `*` = alphanumeric and every other
 * character is a literal. `bind` spreads controlled-input props onto
 * `<input>` so the mask is applied as the user types.
 *
 * @param mask — Pattern of tokens and literals (e.g. `"(999) 999-9999"`, `"##/##/####"`)
 * @returns `{ format, value, raw, set, bind }`
 *
 * @example
 * const phone = useInputMask("999-999-9999");
 * <input {...phone.bind} placeholder="555-123-4567" />
 * <p>raw: {phone.raw()}</p>
 */
export function useInputMask(mask: string): InputMaskControls {
	const literals = new Set([...mask].filter((c) => TOKENS[c] === undefined));

	const format = (input: string): string => {
		const queue = [...input].filter((c) => !literals.has(c));
		let out = "";
		let i = 0;
		for (const m of mask) {
			const token = TOKENS[m];
			if (token === undefined) {
				// Literal — emit only while more input remains for the next slots.
				if (i < queue.length) out += m;
				else break;
				continue;
			}
			while (i < queue.length && !token(queue[i] ?? "")) i++;
			if (i >= queue.length) break;
			const taken = queue[i];
			if (taken === undefined) break;
			out += taken;
			i++;
		}
		return out;
	};

	const [input, setInput] = createSignal("");
	const value = createMemo(() => format(input()));
	const raw = createMemo(() => [...value()].filter((c) => !literals.has(c)).join(""));

	const set = (next: string) => setInput(format(next));

	const bind = {
		get value() {
			return value();
		},
		onInput: (e: InputEvent & { currentTarget: HTMLInputElement }) => {
			const masked = format(e.currentTarget.value);
			setInput(masked);
			e.currentTarget.value = masked;
		},
	};

	return { format, value, raw, set, bind };
}
