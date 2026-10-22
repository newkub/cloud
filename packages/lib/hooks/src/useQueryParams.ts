import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export interface QueryParamsControls {
	/** All params as a plain `Record<string, string>` — reactive */
	params: Accessor<Record<string, string>>;
	/** Reactive read of one param — `undefined` when absent */
	get: (key: string) => string | undefined;
	/** Write one param via `history.replaceState` — no navigation, no reload */
	set: (key: string, value: string) => void;
	/** Delete one param */
	remove: (key: string) => void;
	/** Merge many params at once — `null`/`undefined` values delete their key */
	setAll: (next: Record<string, string | null | undefined>) => void;
}

const readSearch = () => (typeof window === "undefined" ? "" : window.location.search);

/**
 * Typed `URLSearchParams` binding — `params`/`get` track `location.search`,
 * `set`/`remove`/`setAll` write through `history.replaceState` (no navigation,
 * no reload), and `popstate` re-syncs on back/forward.
 * SSR-safe: reads are empty and writes no-op without `window`.
 *
 * @returns `{ params, get, set, remove, setAll }`
 *
 * @example
 * const q = useQueryParams();
 * q.set("tab", "hooks");                 // ?tab=hooks
 * q.setAll({ page: "2", filter: null }); // merge, `filter` removed
 * <p>{q.get("tab")}</p>
 */
export function useQueryParams(): QueryParamsControls {
	const [raw, setRaw] = createSignal(readSearch());

	onMount(() => {
		const sync = () => setRaw(window.location.search);
		sync();
		window.addEventListener("popstate", sync);
		onCleanup(() => window.removeEventListener("popstate", sync));
	});

	const params = createMemo<Record<string, string>>(() => {
		const search = new URLSearchParams(raw());
		const out: Record<string, string> = {};
		for (const [key, value] of search) out[key] = value;
		return out;
	});

	const write = (mutate: (search: URLSearchParams) => void) => {
		if (typeof window === "undefined") return;
		const search = new URLSearchParams(window.location.search);
		mutate(search);
		const qs = search.toString();
		window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
		setRaw(window.location.search);
	};

	return {
		params,
		get: (key) => params()[key],
		set: (key, value) => write((search) => search.set(key, value)),
		remove: (key) => write((search) => search.delete(key)),
		setAll: (next) =>
			write((search) => {
				for (const [key, value] of Object.entries(next)) {
					if (value == null) search.delete(key);
					else search.set(key, value);
				}
			}),
	};
}
