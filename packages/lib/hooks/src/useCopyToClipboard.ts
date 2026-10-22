import { createSignal, onCleanup } from "solid-js";

export interface CopyToClipboardOptions {
	/** Milliseconds before `copied()` flips back to false. @default 1600 */
	copiedTimeout?: number;
	/** Try the legacy `execCommand("copy")` path when `navigator.clipboard` is unavailable or rejects. @default true */
	legacyFallback?: boolean;
}

/**
 * Copy text to the clipboard with a `copied()` flag that auto-resets.
 * Accepts the legacy `resetMs` number or an options object. When the async
 * Clipboard API is missing (insecure context, SSR) or rejects, falls back to
 * a hidden `<textarea>` + `execCommand("copy")` unless `legacyFallback` is off.
 *
 * @param options — Reset delay in ms, or {@link CopyToClipboardOptions}
 * @returns `{ copy, copied, error, supported }` — `copy` resolves true on success
 *
 * @example
 * const { copy, copied } = useCopyToClipboard({ copiedTimeout: 2000 });
 * <button onClick={() => copy(url)}>{copied() ? "Copied!" : "Copy"}</button>
 */
export function useCopyToClipboard(options?: number | CopyToClipboardOptions) {
	const opts = typeof options === "number" ? { copiedTimeout: options } : (options ?? {});
	const timeout = opts.copiedTimeout ?? 1600;
	const [copied, setCopied] = createSignal(false);
	const [error, setError] = createSignal<Error>();
	let timer: ReturnType<typeof setTimeout> | undefined;

	/** True when the async Clipboard API is present (secure context). */
	const supported = () => typeof navigator !== "undefined" && !!navigator.clipboard;

	const markCopied = () => {
		setCopied(true);
		clearTimeout(timer);
		timer = setTimeout(() => setCopied(false), timeout);
	};

	const legacyCopy = (text: string): boolean => {
		if (typeof document === "undefined" || typeof document.execCommand !== "function") return false;
		const area = document.createElement("textarea");
		area.value = text;
		area.setAttribute("readonly", "");
		area.style.position = "fixed";
		area.style.opacity = "0";
		document.body.appendChild(area);
		area.select();
		try {
			return document.execCommand("copy");
		} catch {
			return false;
		} finally {
			area.remove();
		}
	};

	const copy = async (text: string): Promise<boolean> => {
		let failure: unknown;
		if (supported()) {
			try {
				await navigator.clipboard.writeText(text);
				markCopied();
				setError(undefined);
				return true;
			} catch (e) {
				failure = e;
			}
		}
		if (opts.legacyFallback !== false && legacyCopy(text)) {
			markCopied();
			setError(undefined);
			return true;
		}
		setCopied(false);
		setError(failure instanceof Error ? failure : new Error(failure ? String(failure) : "Clipboard API unavailable"));
		return false;
	};

	onCleanup(() => clearTimeout(timer));
	return { copy, copied, error, supported };
}
