import { onCleanup, onMount } from "solid-js";

export interface FocusReturnControls {
	/** Restore focus to the element captured on mount — safe to call manually */
	restore: () => void;
}

/**
 * Capture `document.activeElement` on mount and restore it on cleanup —
 * the classic dialog/popover pattern where closing returns focus to the
 * trigger. `restore()` is also exposed for manual use (e.g. on cancel
 * before unmount). No-ops when the captured node left the document or in
 * SSR.
 *
 * @returns `{ restore }` — manual restore plus automatic restore on cleanup
 *
 * @example
 * const { restore } = useFocusReturn();
 * <button onClick={restore}>cancel</button>
 */
export function useFocusReturn(): FocusReturnControls {
	let captured: HTMLElement | null = null;

	const restore = () => {
		if (typeof document === "undefined") return;
		if (captured && document.contains(captured)) captured.focus();
	};

	onMount(() => {
		captured = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	});

	onCleanup(restore);

	return { restore };
}
