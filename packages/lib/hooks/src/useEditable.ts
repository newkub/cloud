import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface EditableControls {
	/** Ref callback — binds the element, sets `contenteditable` and seeds `initial` */
	ref: (el: HTMLElement) => void;
	/** Plain-text content (`textContent`), synced on `input` */
	text: Accessor<string>;
	/** HTML content (`innerHTML`), synced on `input` */
	html: Accessor<string>;
	/** Write plain text — updates the element and the signals */
	setText: (value: string) => void;
	/** Write HTML — updates the element and the signals */
	setHtml: (value: string) => void;
	/** Focus the bound element — no-op when unbound */
	focus: () => void;
	/** Currently bound element, `null` when none */
	element: Accessor<HTMLElement | null>;
}

/**
 * Two-way bound `contentEditable` element — `ref` marks the node editable and
 * `input` events keep `text()`/`html()` in sync with the DOM. `setText`/
 * `setHtml` push programmatic edits back into the element.
 *
 * @param initial — Optional seed content (`html` wins over `text`)
 * @returns `{ ref, text, html, setText, setHtml, focus, element }`
 *
 * @example
 * const ed = useEditable({ text: "hello" });
 * <div ref={ed.ref} /> // user typing updates ed.text() / ed.html()
 */
export function useEditable(initial?: { text?: string; html?: string }): EditableControls {
	const [text, setTextSignal] = createSignal(initial?.text ?? "");
	const [html, setHtmlSignal] = createSignal(initial?.html ?? "");
	const [element, setElement] = createSignal<HTMLElement | null>(null);

	const onInput = () => {
		const el = element();
		if (!el) return;
		setTextSignal(el.textContent ?? "");
		setHtmlSignal(el.innerHTML);
	};

	const ref = (el: HTMLElement) => {
		const prev = element();
		if (prev === el) return;
		prev?.removeEventListener("input", onInput);
		el.contentEditable = "true";
		if (initial?.html !== undefined) el.innerHTML = initial.html;
		else if (initial?.text !== undefined) el.textContent = initial.text;
		setElement(el);
		setTextSignal(el.textContent ?? "");
		setHtmlSignal(el.innerHTML);
		el.addEventListener("input", onInput);
	};

	onCleanup(() => {
		element()?.removeEventListener("input", onInput);
		setElement(null);
	});

	return {
		ref,
		text,
		html,
		setText: (value: string) => {
			const el = element();
			if (el && el.textContent !== value) el.textContent = value;
			setTextSignal(value);
			if (el) setHtmlSignal(el.innerHTML);
		},
		setHtml: (value: string) => {
			const el = element();
			if (el && el.innerHTML !== value) el.innerHTML = value;
			setHtmlSignal(value);
			if (el) setTextSignal(el.textContent ?? "");
		},
		focus: () => element()?.focus(),
		element,
	};
}
