import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface TextSelection {
	/** Selected text (`selection.toString()`) */
	text: string;
	/** Bounding rect of the first range — `null` when unavailable */
	rect: DOMRect | null;
}

/**
 * Current document selection as a signal — updates on `selectionchange`;
 * `null` while the selection is empty or collapsed (bare caret).
 *
 * @returns Accessor for `{ text, rect }` or `null`
 *
 * @example
 * const sel = useTextSelection();
 * <Show when={sel()}>{(s) => <mark>{s().text}</mark>}</Show>
 */
export function useTextSelection(): Accessor<TextSelection | null> {
	const [selection, setSelection] = createSignal<TextSelection | null>(null);

	onMount(() => {
		const read = () => {
			const sel = document.getSelection();
			if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
				setSelection(null);
				return;
			}
			setSelection({ text: sel.toString(), rect: sel.getRangeAt(0).getBoundingClientRect() });
		};
		document.addEventListener("selectionchange", read);
		onCleanup(() => document.removeEventListener("selectionchange", read));
	});

	return selection;
}
