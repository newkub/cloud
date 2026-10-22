import { type Accessor, createSignal } from "solid-js";

export interface ClipboardReadState {
	/** Last text read from the clipboard — `null` until `read()` succeeds */
	text: Accessor<string | null>;
	/** Whether `navigator.clipboard.readText` exists */
	supported: boolean;
	/** Read the clipboard — resolves with the text (also stored in `text`) or `null` on failure */
	read: () => Promise<string | null>;
	/** Last error message from a failed `read()` — `null` when healthy */
	error: Accessor<string | null>;
}

/**
 * Read-only clipboard access via `navigator.clipboard.readText` — requires a
 * secure context and (usually) the `clipboard-read` permission. `supported` is
 * a static flag; `read()` is a safe no-op that records an `error` when the API
 * is missing or permission is denied.
 *
 * @returns `{ text, supported, read, error }`
 *
 * @example
 * const clip = useClipboardRead();
 * <button onClick={() => clip.read()}>paste</button>
 * <Show when={clip.text()}>{(t) => <p>{t()}</p>}</Show>
 */
export function useClipboardRead(): ClipboardReadState {
	const [text, setText] = createSignal<string | null>(null);
	const [error, setError] = createSignal<string | null>(null);
	const supported = typeof navigator !== "undefined" && typeof navigator.clipboard?.readText === "function";

	const read = async (): Promise<string | null> => {
		if (!supported) {
			setError("Clipboard read API is not supported");
			return null;
		}
		try {
			const value = await navigator.clipboard.readText();
			setText(value);
			setError(null);
			return value;
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			return null;
		}
	};

	return { text, supported, read, error };
}
