import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";

export interface CaretPosition {
	/** `selectionStart` — caret/anchor index */
	start: number;
	/** `selectionEnd` — focus index (equals `start` for a bare caret) */
	end: number;
}

const FIELD_EVENTS = ["select", "keyup", "click", "input"] as const;

/**
 * Caret/selection offsets inside an `<input>` or `<textarea>` — updates on
 * `selectionchange` plus `select`/`keyup`/`click`/`input` on the field.
 * Only reads while the element holds focus.
 *
 * @param ref — Accessor for the input/textarea element
 * @returns Accessor for `{ start, end }` offsets
 *
 * @example
 * let area!: HTMLTextAreaElement;
 * const caret = useCaret(() => area);
 * <p>{caret().start}–{caret().end}</p>
 */
export function useCaret(ref: Accessor<HTMLInputElement | HTMLTextAreaElement | undefined>): Accessor<CaretPosition> {
	const [caret, setCaret] = createSignal<CaretPosition>({ start: 0, end: 0 });

	const read = () => {
		const el = ref();
		if (!el || document.activeElement !== el) return;
		setCaret({ start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 });
	};

	onMount(() => {
		document.addEventListener("selectionchange", read);
		onCleanup(() => document.removeEventListener("selectionchange", read));
	});

	createEffect(() => {
		const el = ref();
		if (!el) return;
		for (const type of FIELD_EVENTS) el.addEventListener(type, read);
		onCleanup(() => {
			for (const type of FIELD_EVENTS) el.removeEventListener(type, read);
		});
	});

	return caret;
}
