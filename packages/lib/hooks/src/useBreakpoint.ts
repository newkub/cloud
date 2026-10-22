import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export const DEFAULT_BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export interface BreakpointState<K extends string> {
	/** Largest matching breakpoint name — falls back to the smallest key below all min-widths */
	current: Accessor<K>;
	/** Accessor that's true while the viewport is at least `name`'s min-width */
	atLeast: (name: K) => Accessor<boolean>;
}

/**
 * Responsive breakpoints via `matchMedia("(min-width: Npx)")` — mobile-first,
 * Tailwind-style defaults (`sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280).
 * SSR-safe: `current()` is the smallest key and every `atLeast()` is false.
 *
 * @param map — Breakpoint name → min-width in px. @default DEFAULT_BREAKPOINTS
 * @returns `{ current, atLeast }` — `atLeast("md")()` is true from 768px up
 *
 * @example
 * const bp = useBreakpoint();
 * <Show when={bp.atLeast("lg")()}><WideSidebar /></Show>
 */
export function useBreakpoint<M extends Record<string, number> = typeof DEFAULT_BREAKPOINTS>(
	map?: M,
): BreakpointState<Extract<keyof M, string>> {
	type K = Extract<keyof M, string>;
	const entries = Object.entries(map ?? DEFAULT_BREAKPOINTS).sort((a, b) => a[1] - b[1]) as [K, number][];
	const [matches, setMatches] = createSignal<Partial<Record<K, boolean>>>({});

	onMount(() => {
		const cleanups = entries.map(([name, px]) => {
			const mql = window.matchMedia(`(min-width: ${px}px)`);
			const read = () => setMatches((m) => ({ ...m, [name]: mql.matches }));
			read();
			mql.addEventListener("change", read);
			return () => mql.removeEventListener("change", read);
		});
		onCleanup(() => {
			for (const cleanup of cleanups) cleanup();
		});
	});

	const current = createMemo<K>(() => {
		const m = matches();
		let active = entries[0]?.[0] as K;
		for (const [name] of entries) if (m[name]) active = name;
		return active;
	});

	return {
		current,
		atLeast: (name: K) => () => matches()[name] ?? false,
	};
}
