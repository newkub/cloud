import { type Accessor, onCleanup } from "solid-js";

export interface EscapeKeyOptions {
	/** Only fire while this returns true @default () => true */
	when?: Accessor<boolean> | (() => boolean);
	/** Listen on a specific target instead of document */
	target?: Accessor<Document | HTMLElement | undefined>;
}

/**
 * Escape-key handler — attaches a `keydown` listener that calls `onEscape`
 * when Escape is pressed. Shared by overlays, menus, dialogs and pickers so
 * they don't each hand-roll the listener.
 *
 * @param onEscape — called when Escape is pressed while `when()` is truthy
 * @param options — `when` gate + custom `target`
 * @returns nothing — cleanup is automatic via the reactive root
 *
 * @example
 * useEscapeKey(() => setOpen(false), { when: open });
 */
export function useEscapeKey(onEscape: (e: KeyboardEvent) => void, options?: EscapeKeyOptions): void {
	const target = options?.target?.() ?? (typeof document !== "undefined" ? document : undefined);
	if (!target) return;
	const handler = (e: Event) => {
		const ke = e as KeyboardEvent;
		if (ke.key === "Escape" && (options?.when?.() ?? true)) onEscape(ke);
	};
	target.addEventListener("keydown", handler);
	onCleanup(() => target.removeEventListener("keydown", handler));
}
