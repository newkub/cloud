import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface KeyStrokeOptions {
	/** Fire on keyup instead of keydown. @default false */
	event?: "keydown" | "keyup";
	/** Listen target. @default window */
	target?: Window | HTMLElement;
	/** Skip INPUT/TEXTAREA/contenteditable targets for named keys. @default false */
	exclude?: string[];
}

export interface KeyStrokeControls {
	/** How many times the key has fired */
	count: Accessor<number>;
	/** Reset the counter */
	reset: () => void;
}

/**
 * Listen for a single key stroke — pass a key name (`"k"`, `"Escape"`,
 * `"Enter"`) plus handler, or just a handler to track any key. Returns a
 * press counter. Case-insensitive for the key; modifiers must be pressed
 * separately (see `useMagicKeys`). SSR-safe.
 *
 * @param keyOrHandler — Key name, or the handler (fires for every key)
 * @param handlerOrOptions — Handler (when a key was given) or options
 * @param maybeOptions — Options when called as `(key, handler, options)`
 * @returns `{ count, reset }`
 *
 * @example
 * let n = 0;
 * const s = useKeyStroke("k", () => n++);
 * <button onClick={() => s.reset()}>pressed {s.count()}</button>
 */
export function useKeyStroke(
	keyOrHandler: string | ((e: KeyboardEvent) => void),
	handlerOrOptions?: ((e: KeyboardEvent) => void) | KeyStrokeOptions,
	maybeOptions?: KeyStrokeOptions,
): KeyStrokeControls {
	const key = typeof keyOrHandler === "string" ? keyOrHandler.toLowerCase() : undefined;
	const handler =
		typeof keyOrHandler === "function"
			? keyOrHandler
			: typeof handlerOrOptions === "function"
				? handlerOrOptions
				: undefined;
	const options = (typeof handlerOrOptions === "object" ? handlerOrOptions : maybeOptions) ?? {};

	const [count, setCount] = createSignal(0);

	onMount(() => {
		if (typeof window === "undefined") return;
		const node: Window | HTMLElement = options.target ?? window;
		const type = options.event ?? "keydown";

		const onKey = (e: KeyboardEvent) => {
			if (key && e.key.toLowerCase() !== key) return;
			if (options.exclude?.includes(e.key)) return;
			setCount((c) => c + 1);
			handler?.(e);
		};
		// the Window|HTMLElement union erases the typed "keydown" overload
		const listener = onKey as EventListener;

		node.addEventListener(type, listener);
		onCleanup(() => node.removeEventListener(type, listener));
	});

	return { count, reset: () => setCount(0) };
}
