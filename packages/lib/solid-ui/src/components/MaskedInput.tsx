/**
 * MaskedInput - input that formats the value against a mask pattern.
 * Mask tokens: `#` digit, `A` letter, `*` alphanumeric. Other chars are literals.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { Input } from "./Input";

export interface MaskedInputProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onInput" | "onChange" | "value" | "size"> {
	/** Mask pattern, e.g. "(###) ###-####" or "##/##/####". */
	mask?: string;
	/** Current raw (unmasked) value. */
	value?: string;
	/** Called with the raw unmasked value whenever it changes. */
	onValueChange?: (value: string) => void;
}

function applyMask(raw: string, mask: string): string {
	let out = "";
	let i = 0;
	for (const ch of mask) {
		if (i >= raw.length) break;
		const isToken = ch === "#" || ch === "A" || ch === "*";
		if (!isToken) {
			out += ch;
			continue;
		}
		// find next acceptable raw char
		while (i < raw.length) {
			const c = raw[i++];
			const ok = ch === "#" ? /\d/.test(c) : ch === "A" ? /[a-zA-Z]/.test(c) : /[a-zA-Z0-9]/.test(c);
			if (ok) {
				out += c;
				break;
			}
		}
	}
	return out;
}

function unmask(masked: string, mask: string): string {
	let out = "";
	for (let i = 0; i < masked.length; i++) {
		const token = mask[i];
		const isToken = token === "#" || token === "A" || token === "*";
		if (isToken) out += masked[i];
	}
	return out;
}

export function MaskedInput(props: MaskedInputProps) {
	const [local, rest] = splitProps(props, ["class", "mask", "value", "onValueChange", "placeholder"]);
	const mask = () => local.mask ?? "";
	const [internal, setInternal] = createSignal(applyMask(local.value ?? "", mask()));

	const display = () => (local.value !== undefined ? applyMask(local.value, mask()) : internal());

	const onInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
		const raw = unmask(e.currentTarget.value, mask());
		const masked = applyMask(raw, mask());
		setInternal(masked);
		e.currentTarget.value = masked;
		local.onValueChange?.(raw);
	};

	return (
		<Input
			class={`solidui-masked-input ${local.class ?? ""}`}
			value={display()}
			placeholder={local.placeholder ?? local.mask}
			onInput={onInput}
			{...rest}
		/>
	);
}
