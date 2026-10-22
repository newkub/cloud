import { onCleanup, onMount } from "solid-js";

export interface ScrollRestoreControls {
	/** Persist the current window scroll position under `key` */
	save: () => void;
	/** Scroll back to the stored position — no-op when nothing is saved */
	restore: () => void;
}

/**
 * Remember the window scroll position across mounts — restores on mount and
 * saves on cleanup and `pagehide`, stored in `sessionStorage` under
 * `scroll-restore:<key>` so it survives in-session navigation but not the
 * browser session. SSR-safe.
 *
 * @param key — Storage key suffix, e.g. a route path
 * @returns `{ save, restore }` for manual control
 *
 * @example
 * // inside a routed page component
 * useScrollRestore("/docs/hooks");
 */
export function useScrollRestore(key: string): ScrollRestoreControls {
	const storageKey = `scroll-restore:${key}`;

	const save = () => {
		if (typeof window === "undefined") return;
		try {
			sessionStorage.setItem(storageKey, JSON.stringify({ x: window.scrollX, y: window.scrollY }));
		} catch {
			/* storage unavailable/blocked — skip persistence */
		}
	};

	const restore = () => {
		if (typeof window === "undefined") return;
		try {
			const raw = sessionStorage.getItem(storageKey);
			if (!raw) return;
			const pos = JSON.parse(raw) as { x?: number; y?: number };
			if (typeof pos?.x !== "number" || typeof pos?.y !== "number") return;
			window.scrollTo(pos.x, pos.y);
		} catch {
			/* corrupted entry — ignore */
		}
	};

	onMount(() => {
		if (typeof window === "undefined") return;
		restore();
		window.addEventListener("pagehide", save);
	});

	onCleanup(() => {
		save();
		if (typeof window !== "undefined") window.removeEventListener("pagehide", save);
	});

	return { save, restore };
}
