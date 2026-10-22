import { type Accessor, createSignal } from "solid-js";

/**
 * Setter used by `update` and passed to actions — a plain-object patch is
 * merged into the current state; anything else (or an updater's result that
 * isn't a plain object) replaces it.
 */
export type StoreSet<T> = (patch: Partial<T> | ((prev: T) => T | Partial<T>)) => void;

/** Named action map — each action receives `(set, get, ...args)` before being bound. */
export type StoreActionMap<T> = Record<string, (set: StoreSet<T>, get: Accessor<T>, ...args: never[]) => void>;

/** `actions` with `set`/`get` already bound — each entry keeps only its own `...args`. */
export type BoundActions<T, A extends StoreActionMap<T>> = {
	[K in keyof A]: A[K] extends (set: StoreSet<T>, get: Accessor<T>, ...args: infer P) => infer R
		? (...args: P) => R
		: never;
};

export interface StoreControls<T, A extends StoreActionMap<T> = Record<never, never>> {
	/** Current state. */
	state: Accessor<T>;
	/** Merge an object patch or compute the next state via an updater. */
	update: StoreSet<T>;
	/** Restore the initial state. */
	reset: () => void;
	/** Provided actions bound to this store. */
	actions: BoundActions<T, A>;
}

const mergeable = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Mini store factory — a single signal with `update` (patch or updater) and
 * `reset`, plus optional named actions. Actions are declared once as
 * `(set, get, ...args) => void` and exposed on `actions` already bound, so
 * `store.actions.inc(2)` works without passing state around.
 *
 * @param initial — Initial state value
 * @param actions — Optional `{ name: (set, get, ...args) => void }` map
 * @returns `{ state, update, reset, actions }`
 *
 * @example
 * const store = useStore({ count: 0 }, {
 *   inc: (set, get, by = 1) => set({ count: get().count + by }),
 * });
 * store.actions.inc(5);
 * <p>{store.state().count}</p>
 */
export function useStore<T, A extends StoreActionMap<T> = Record<never, never>>(
	initial: T,
	actions?: A & StoreActionMap<T>,
): StoreControls<T, A> {
	const [state, setState] = createSignal<T>(initial);

	const update: StoreSet<T> = (patch) => {
		setState((prev) => {
			const next = typeof patch === "function" ? patch(prev) : patch;
			return mergeable(prev) && mergeable(next) ? ({ ...prev, ...next } as T) : (next as T);
		});
	};

	const bound = {} as BoundActions<T, A>;
	const map = (actions ?? {}) as Record<string, (set: StoreSet<T>, get: Accessor<T>, ...args: unknown[]) => void>;
	for (const key of Object.keys(map)) {
		const action = map[key];
		if (!action) continue;
		(bound as Record<string, unknown>)[key] = (...args: unknown[]) => action(update, state, ...args);
	}

	return { state, update, reset: () => setState(() => initial), actions: bound };
}
