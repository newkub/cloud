import { type Accessor, createSignal, onMount } from "solid-js";

export interface KeyboardLayoutMapLike {
	readonly size: number;
	get(key: string): string | undefined;
	has(key: string): boolean;
	entries(): IterableIterator<[string, string]>;
	keys(): IterableIterator<string>;
	values(): IterableIterator<string>;
	forEach(cb: (value: string, key: string, map: KeyboardLayoutMapLike) => void): void;
}

interface KeyboardLike {
	getLayoutMap(): Promise<KeyboardLayoutMapLike>;
}

export interface KeyboardLayoutState {
	/** `navigator.keyboard.getLayoutMap` support flag */
	supported: boolean;
	/** The fetched layout map — undefined while loading or unsupported */
	layoutMap: Accessor<KeyboardLayoutMapLike | undefined>;
	/** Lookup a `KeyboardEvent.code` (e.g. `"KeyQ"`) → produced character */
	get: (key: string) => string | undefined;
	/** Last error message */
	error: Accessor<string | undefined>;
}

/**
 * Keyboard API — resolves the user's physical layout via
 * `navigator.keyboard.getLayoutMap()` into a map of `code → character`.
 * `get()` returns `undefined` until the map resolves or when unsupported.
 *
 * @returns `{ supported, layoutMap, get, error }`
 *
 * @example
 * const kb = useKeyboardLayout();
 * <kbd>{kb.get("KeyW") ?? "W"}</kbd> // shows "Z" on AZERTY
 */
export function useKeyboardLayout(): KeyboardLayoutState {
	const keyboard = typeof navigator === "undefined" ? undefined : (navigator as { keyboard?: KeyboardLike }).keyboard;
	const supported =
		typeof navigator !== "undefined" && "keyboard" in navigator && typeof keyboard?.getLayoutMap === "function";
	const [layoutMap, setLayoutMap] = createSignal<KeyboardLayoutMapLike>();
	const [error, setError] = createSignal<string>();

	onMount(() => {
		if (!keyboard || typeof keyboard.getLayoutMap !== "function") return;
		keyboard
			.getLayoutMap()
			.then((map) => {
				setLayoutMap(map);
				setError(undefined);
			})
			.catch((e) => setError(e instanceof Error ? e.message : "getLayoutMap failed"));
	});

	return { supported, layoutMap, get: (key) => layoutMap()?.get(key), error };
}
