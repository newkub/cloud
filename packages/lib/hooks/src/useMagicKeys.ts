import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface MagicKeysState {
	/** All keys currently pressed, in press order */
	current: Accessor<string[]>;
	/** True while any key is down */
	any: Accessor<boolean>;
	/** Last pressed key name, or null */
	last: Accessor<string | null>;
	/** Any other key name resolves to a pressed accessor (`keys.a()`) */
	[key: string]: Accessor<boolean> | Accessor<string[]> | Accessor<string | null>;
}

export interface MagicKeysOptions {
	/** Only listen while the target has focus. @default global (window) */
	target?: HTMLElement;
	/** Fire on keyup as well as keydown for `current` updates. @default true */
	reactOnKeyup?: boolean;
}

const normalize = (key: string) => {
	const map: Record<string, string> = {
		meta: "meta",
		ctl: "control",
		cmdOrCtrl: "control",
		arrowup: "arrowup",
		arrowdown: "arrowdown",
		arrowleft: "arrowleft",
		arrowright: "arrowright",
	};
	const lower = key.toLowerCase();
	return map[lower] ?? lower;
};

/**
 * Reactive keyboard state — every key name becomes a `true`/`false` accessor
 * (`keys.space()`, `keys.control()`, `keys.a()`), plus `current`, `any` and
 * `last`. Modifiers use their `KeyboardEvent.key` lowercased. SSR-safe;
 * listeners are removed on cleanup.
 *
 * @param options — `target` element to scope listening, `reactOnKeyup`
 * @returns proxied map of key accessors plus `current` / `any` / `last`
 *
 * @example
 * const keys = useMagicKeys();
 * <Effect>{() => keys.escape() && closeModal()}</Effect>
 * <Show when={keys.control() && keys.k()}>
 *   <p>Ctrl+K pressed</p>
 * </Show>
 */
export function useMagicKeys(options?: MagicKeysOptions): MagicKeysState {
	const [pressed, setPressed] = createSignal<Record<string, boolean>>({});
	const [order, setOrder] = createSignal<string[]>([]);
	const [last, setLast] = createSignal<string | null>(null);

	onMount(() => {
		if (typeof window === "undefined") return;
		const node: Window | HTMLElement = options?.target ?? window;
		const isTypingTarget = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
		};

		const onDown = (e: KeyboardEvent) => {
			const key = normalize(e.key);
			if (!key) return;
			setLast(key);
			if (isTypingTarget(e) && e.key.length > 1) return;
			setPressed((p) => (p[key] ? p : { ...p, [key]: true }));
			setOrder((o) => (o.includes(key) ? o : [...o, key]));
		};
		const onUp = (e: KeyboardEvent) => {
			if (options?.reactOnKeyup === false) return;
			const key = normalize(e.key);
			setPressed((p) => {
				if (!p[key]) return p;
				const next = { ...p };
				delete next[key];
				return next;
			});
			setOrder((o) => o.filter((k) => k !== key));
		};

		const listenerDown = onDown as EventListener;
		const listenerUp = onUp as EventListener;
		node.addEventListener("keydown", listenerDown);
		node.addEventListener("keyup", listenerUp);
		const onBlur = () => {
			setPressed({});
			setOrder([]);
		};
		window.addEventListener("blur", onBlur);
		onCleanup(() => {
			node.removeEventListener("keydown", listenerDown);
			node.removeEventListener("keyup", listenerUp);
			window.removeEventListener("blur", onBlur);
		});
	});

	const reserved: MagicKeysState = {
		current: () => order(),
		any: () => order().length > 0,
		last,
	};

	return new Proxy(reserved, {
		get(target, prop: string | symbol) {
			if (typeof prop !== "string") return undefined;
			if (prop in target) return target[prop as keyof MagicKeysState];
			return () => !!pressed()[normalize(prop)];
		},
	}) as MagicKeysState;
}
