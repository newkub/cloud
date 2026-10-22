import { type Accessor, onCleanup, onMount } from "solid-js";

export type HotkeyMap = Record<string, (e: KeyboardEvent) => void>;

/**
 * Normalize an event into a combo string like `mod+k`, `shift+/`, `alt+arrowup`.
 * `mod` maps to Ctrl on Windows/Linux and Cmd on macOS.
 */
function comboOf(e: KeyboardEvent): string {
	const parts: string[] = [];
	if (e.ctrlKey || e.metaKey) parts.push("mod");
	if (e.altKey) parts.push("alt");
	if (e.shiftKey) parts.push("shift");
	parts.push(e.key.toLowerCase());
	return parts.join("+");
}

const isTypingTarget = (t: EventTarget | null) =>
	t instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable);

/**
 * Register global keyboard shortcuts — `useHotkeys({ "mod+k": open, "shift+/": help })`.
 * Combos are ignored while the user is typing in form fields unless
 * `runWhileTyping` is set.
 *
 * @param map — Combo string (`mod+k`, `shift+/`, `escape`, …) → handler
 * @param options — `enabled` gates all bindings (boolean or accessor);
 * `preventDefault` suppresses the browser default on a match;
 * `runWhileTyping` fires combos inside inputs too
 *
 * @example
 * useHotkeys({ "mod+k": () => setOpen(true), escape: () => setOpen(false) });
 * useHotkeys({ "mod+s": save }, { preventDefault: true, enabled: dirty });
 */
export function useHotkeys(
	map: HotkeyMap,
	options?: {
		/** Gate every binding — static flag or accessor. @default true */
		enabled?: boolean | Accessor<boolean>;
		/** Call `preventDefault()` when a combo matches. @default false */
		preventDefault?: boolean;
		/** Fire combos while typing in form fields. @default false */
		runWhileTyping?: boolean;
	},
) {
	function onKeyDown(e: KeyboardEvent) {
		const enabled = typeof options?.enabled === "function" ? options.enabled() : (options?.enabled ?? true);
		if (!enabled) return;
		if (!options?.runWhileTyping && isTypingTarget(e.target)) return;
		const handler = map[comboOf(e)];
		if (!handler) return;
		if (options?.preventDefault) e.preventDefault();
		handler(e);
	}
	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
		onCleanup(() => document.removeEventListener("keydown", onKeyDown));
	});
}
