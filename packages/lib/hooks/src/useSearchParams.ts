import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export interface SearchParamsControls {
	/** Reactive read of one param — tracks when called inside a reactive scope */
	get: (name: string) => string | undefined;
	/** Write a param via `history.replaceState` — pass `null`/`undefined` to remove it */
	set: (name: string, value: string | null | undefined) => void;
	/** All params as a plain `Record<string, string>` */
	all: Accessor<Record<string, string>>;
}

/**
 * Reactive URL query params — `get`/`all` track `location.search`, `set`
 * writes through `history.replaceState` (no navigation, no reload) and
 * `popstate` re-syncs on back/forward. SSR-safe: reads are empty and `set`
 * is a no-op.
 *
 * @returns `{ get, set, all }` controls
 *
 * @example
 * const params = useSearchParams();
 * params.set("tab", "hooks");            // ?tab=hooks
 * <p>{params.get("tab")}</p>
 */
export function useSearchParams(): SearchParamsControls {
	const [raw, setRaw] = createSignal("");

	onMount(() => {
		const read = () => setRaw(window.location.search);
		read();
		window.addEventListener("popstate", read);
		onCleanup(() => window.removeEventListener("popstate", read));
	});

	const all = createMemo<Record<string, string>>(() => {
		const params = new URLSearchParams(raw());
		const out: Record<string, string> = {};
		for (const [key, value] of params) out[key] = value;
		return out;
	});

	const set = (name: string, value: string | null | undefined) => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		if (value == null) params.delete(name);
		else params.set(name, value);
		const qs = params.toString();
		window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
		setRaw(window.location.search);
	};

	return { get: (name) => all()[name], set, all };
}
