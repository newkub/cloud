import { type Accessor, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

type ShortcutHandler = (e: KeyboardEvent) => void;

/** Canonical combo string for a KeyboardEvent, e.g. `"ctrl+shift+k"`. */
const comboOf = (e: KeyboardEvent): string =>
	`${e.ctrlKey ? "ctrl+" : ""}${e.altKey ? "alt+" : ""}${e.shiftKey ? "shift+" : ""}${e.metaKey ? "meta+" : ""}${e.key.toLowerCase()}`;

/** Canonical form for a bound combo — tokens may appear in any order. */
const normalizeCombo = (combo: string): string => {
	const tokens = combo.toLowerCase().split("+").filter(Boolean);
	const mods = { ctrl: false, alt: false, shift: false, meta: false };
	let key = "";
	for (const t of tokens) {
		if (t === "ctrl" || t === "control") mods.ctrl = true;
		else if (t === "alt" || t === "option") mods.alt = true;
		else if (t === "shift") mods.shift = true;
		else if (t === "meta" || t === "cmd" || t === "command" || t === "mod") mods.meta = true;
		else key = t;
	}
	return `${mods.ctrl ? "ctrl+" : ""}${mods.alt ? "alt+" : ""}${mods.shift ? "shift+" : ""}${mods.meta ? "meta+" : ""}${key}`;
};

export interface ShortcutScopeControls {
	/** Push a scope onto the stack — it becomes `active()` */
	push: (scope: string) => void;
	/** Remove and return the top scope */
	pop: () => string | undefined;
	/** The current top scope — only its bindings fire */
	active: Accessor<string | undefined>;
	/**
	 * Register `handler` for `combo` inside `scope`. Fires only while `scope`
	 * is the top of the stack. Returns an unbind function.
	 */
	bind: (scope: string, combo: string, handler: ShortcutHandler) => () => void;
	/** Current scope stack, bottom → top */
	scopes: Accessor<string[]>;
}

/**
 * Stack-based shortcut scopes — bindings are grouped under named scopes and
 * only the top scope's bindings respond to keydown. Push a modal scope to
 * capture all shortcuts, pop to restore the previous layer. Listens on
 * `target` or window; SSR-safe.
 *
 * @param target — Optional element/accessor to listen on (defaults to window)
 * @returns `{ push, pop, active, bind, scopes }`
 *
 * @example
 * const scope = useShortcutScope();
 * scope.push("app");
 * scope.bind("app", "ctrl+s", () => save());
 * openModal = () => { scope.push("modal"); scope.bind("modal", "escape", closeModal); };
 */
export function useShortcutScope(
	target?: MaybeAccessor<HTMLElement | Window | Document | undefined>,
): ShortcutScopeControls {
	const [stack, setStack] = createSignal<string[]>([]);
	const bindings = new Map<string, Map<string, ShortcutHandler>>();
	let listenerTarget: HTMLElement | Window | Document | undefined;

	const onKey = (e: KeyboardEvent) => {
		const st = stack();
		const top = st[st.length - 1];
		if (top === undefined) return;
		const handler = bindings.get(top)?.get(comboOf(e));
		if (handler) handler(e);
	};

	const attach = (el: HTMLElement | Window | Document) => {
		listenerTarget = el;
		el.addEventListener("keydown", onKey as EventListener);
	};

	// Bind eagerly so `push`/`bind` ordering relative to effects doesn't matter;
	// the listener itself is a no-op until a scope exists.
	if (typeof window !== "undefined") attach(target === undefined ? window : (read(target) ?? window));
	onCleanup(() => listenerTarget?.removeEventListener("keydown", onKey as EventListener));

	return {
		push: (scope) => setStack((st) => [...st, scope]),
		pop: () => {
			const st = stack();
			const top = st[st.length - 1];
			if (st.length > 0) setStack(st.slice(0, -1));
			return top;
		},
		active: () => stack()[stack().length - 1],
		bind: (scope, combo, handler) => {
			const canon = normalizeCombo(combo);
			let scopeMap = bindings.get(scope);
			if (!scopeMap) {
				scopeMap = new Map();
				bindings.set(scope, scopeMap);
			}
			scopeMap.set(canon, handler);
			return () => {
				scopeMap?.delete(canon);
			};
		},
		scopes: stack,
	};
}
