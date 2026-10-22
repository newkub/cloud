import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface ClipboardState {
	/** `navigator.clipboard` support flag (requires a secure context) */
	supported: boolean;
	/** True briefly after a successful copy */
	copied: Accessor<boolean>;
	/** Copy text — resolves `false` when the API is missing or the write fails */
	copy: (text: string) => Promise<boolean>;
	/** Read clipboard text — resolves `undefined` when unavailable or denied */
	read: () => Promise<string | undefined>;
}

/**
 * Clipboard API — `copy`/`read` with a `copied()` flag that auto-resets.
 * Superset of `useCopyToClipboard`; degrades to `supported: false` on
 * insecure contexts or SSR instead of throwing.
 *
 * @param resetMs — Milliseconds before `copied()` flips back to false. @default 1600
 * @returns `{ supported, copied, copy, read }`
 *
 * @example
 * const clip = useClipboard();
 * <button onClick={() => clip.copy(url)}>{clip.copied() ? "Copied!" : "Copy"}</button>
 */
export function useClipboard(resetMs = 1600): ClipboardState {
	const [copied, setCopied] = createSignal(false);
	const supported = typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
	let timer: ReturnType<typeof setTimeout> | undefined;

	const copy = async (text: string) => {
		if (!supported) return false;
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			clearTimeout(timer);
			timer = setTimeout(() => setCopied(false), resetMs);
			return true;
		} catch {
			setCopied(false);
			return false;
		}
	};

	const read = async () => {
		if (typeof navigator === "undefined" || typeof navigator.clipboard?.readText !== "function") {
			return undefined;
		}
		try {
			return await navigator.clipboard.readText();
		} catch {
			return undefined;
		}
	};

	onCleanup(() => clearTimeout(timer));
	return { supported, copied, copy, read };
}
