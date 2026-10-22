import { type Accessor, createSignal } from "solid-js";

export interface SessionStorageControls<T> {
	/** Current value — restored from `sessionStorage` on creation */
	value: Accessor<T>;
	/** Set a value (or updater fn) — persisted as JSON under `key` */
	set: (v: T | ((prev: T) => T)) => void;
	/** Remove the key and reset `value` to `initial` */
	remove: () => void;
}

const readStored = <T>(key: string, initial: T): T => {
	if (typeof window === "undefined") return initial;
	try {
		const raw = window.sessionStorage.getItem(key);
		return raw === null ? initial : (JSON.parse(raw) as T);
	} catch {
		return initial;
	}
};

/**
 * Signal persisted to `sessionStorage` (JSON-serialized) — survives page
 * reloads within the tab session, dies with the tab. Reads happen eagerly so
 * the stored value is available before mount; writes are wrapped in try/catch
 * so quota/serialization failures never crash the app.
 *
 * @param key — `sessionStorage` key
 * @param initial — Fallback when the key is absent or unparseable
 * @returns `{ value, set, remove }`
 *
 * @example
 * const draft = useSessionStorage("editor:draft", "");
 * <textarea value={draft.value()} onInput={(e) => draft.set(e.currentTarget.value)} />
 */
export function useSessionStorage<T>(key: string, initial: T): SessionStorageControls<T> {
	const [value, setValue] = createSignal<T>(readStored(key, initial));

	const set = (v: T | ((prev: T) => T)) => {
		const next = typeof v === "function" ? (v as (prev: T) => T)(value()) : v;
		setValue(() => next);
		if (typeof window === "undefined") return;
		try {
			window.sessionStorage.setItem(key, JSON.stringify(next));
		} catch {
			// quota exceeded or unserializable value — keep the in-memory signal
		}
	};

	const remove = () => {
		setValue(() => initial);
		if (typeof window === "undefined") return;
		try {
			window.sessionStorage.removeItem(key);
		} catch {
			// storage unavailable — ignore
		}
	};

	return { value, set, remove };
}
