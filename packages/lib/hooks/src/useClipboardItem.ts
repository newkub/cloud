import { type Accessor, createSignal, onCleanup } from "solid-js";

/** Options for {@link useClipboardItem}. */
export interface ClipboardItemOptions {
	/** Try to populate `text()` via `navigator.clipboard.readText()` when permitted. @default true */
	read?: boolean;
	/** Refresh `text()` from in-page `copy` events. @default false */
	update?: boolean;
	/** Enable `copy()` through the Async Clipboard `write()` API. @default true */
	write?: boolean;
}

/** Reactive surface returned by {@link useClipboardItem}. */
export interface ClipboardItemState {
	/** Feature flag for `navigator.clipboard.write` + the `ClipboardItem` constructor. */
	isSupported: Accessor<boolean>;
	/** Copy typed data — keys are MIME types, values are strings (auto-blobified) or `Blob`s. */
	copy: (data: Record<string, Blob | string>) => Promise<boolean>;
	/** Latest known clipboard text (from reads, copy events, or local writes). */
	text: Accessor<string>;
	/** `permissions.query` state for the clipboard: `"granted" | "denied" | "prompt" | "unknown"`. */
	permission: Accessor<string>;
}

/**
 * Async Clipboard API around `ClipboardItem` — writes typed data (text,
 * images, …) with `navigator.clipboard.write()`, tracks the permission state,
 * and keeps `text()` fresh via `readText()` and (optionally) `copy` events.
 * Feature-detects everywhere: unsupported environments resolve `copy()` to
 * `false` and never throw.
 *
 * @param options — `read` / `update` / `write` capability toggles
 * @returns `{ isSupported, copy, text, permission }`
 *
 * @example
 * const item = useClipboardItem();
 * await item.copy({ "text/plain": "hello", "text/html": "<b>hello</b>" });
 * <p>{item.text()}</p>
 */
export function useClipboardItem(options?: ClipboardItemOptions): ClipboardItemState {
	const read = options?.read ?? true;
	const update = options?.update ?? false;
	const write = options?.write ?? true;
	const [text, setText] = createSignal("");
	const [permission, setPermission] = createSignal("unknown");
	const supported =
		typeof navigator !== "undefined" &&
		typeof navigator.clipboard?.write === "function" &&
		typeof ClipboardItem !== "undefined";

	const refresh = () => {
		if (!read || permission() === "denied" || typeof navigator?.clipboard?.readText !== "function") return;
		navigator.clipboard.readText().then(setText, () => undefined);
	};

	if (typeof navigator !== "undefined") {
		const name = read || update ? "clipboard-read" : "clipboard-write";
		try {
			navigator.permissions
				?.query({ name } as unknown as PermissionDescriptor)
				.then(
					(status) => setPermission(status?.state ?? "unknown"),
					() => setPermission("denied"),
				)
				.finally(refresh);
		} catch {
			setPermission("unknown");
			refresh();
		}
	}

	const copy = async (data: Record<string, Blob | string>): Promise<boolean> => {
		if (!write || !supported) return false;
		try {
			const entries: Record<string, Blob> = {};
			for (const [type, value] of Object.entries(data)) {
				entries[type] = typeof value === "string" ? new Blob([value], { type }) : value;
			}
			await navigator.clipboard.write([new ClipboardItem(entries)]);
			const plain = data["text/plain"] ?? Object.values(data).find((v) => typeof v === "string");
			if (typeof plain === "string") setText(plain);
			return true;
		} catch {
			return false;
		}
	};

	if (update && typeof document !== "undefined") {
		const onCopy = (event: Event) => {
			const plain = (event as ClipboardEvent).clipboardData?.getData("text/plain");
			if (typeof plain === "string") setText(plain);
		};
		document.addEventListener("copy", onCopy);
		onCleanup(() => document.removeEventListener("copy", onCopy));
	}

	return { isSupported: () => supported, copy, text, permission };
}
