import { type Accessor, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export interface OptimisticOptions<T> {
	/** Persist the optimistic value — a rejection rolls `value` back to what was shown before `apply` */
	commit?: (value: T) => Promise<unknown>;
}

export interface OptimisticState<T> {
	/** Effective value — the optimistic override while set, otherwise `source` */
	value: Accessor<T>;
	/**
	 * Show `patch` immediately, then run `commit`. Resolves `true` when the
	 * value is kept, `false` after a rollback. Latest call wins — a stale
	 * rejection never rolls back a newer apply.
	 */
	apply: (patch: T | ((current: T) => T)) => Promise<boolean>;
	/** True while a `commit` is in flight */
	pending: Accessor<boolean>;
	/** Last commit rejection — cleared on the next `apply` */
	error: Accessor<Error | undefined>;
}

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Optimistic UI state — `apply` renders the patched value instantly while
 * `commit` persists it in the background. A rejected commit rolls the value
 * back and exposes `error`; a resolved commit keeps the optimistic value.
 * Without a `commit` option `apply` just sets the value.
 *
 * @param source — Base value or accessor (e.g. server state, a resource)
 * @param options — `commit` persists each applied value
 * @returns `{ value, apply, pending, error }`
 *
 * @example
 * const star = useOptimistic(() => post().starred, {
 *   commit: (v) => api.setStarred(post().id, v),
 * });
 * <button onClick={() => star.apply((s) => !s)}>{star.value() ? "★" : "☆"}</button>
 */
export function useOptimistic<T>(source: MaybeAccessor<T>, options?: OptimisticOptions<T>): OptimisticState<T> {
	const [override, setOverride] = createSignal<T>();
	const [hasOverride, setHasOverride] = createSignal(false);
	const [pending, setPending] = createSignal(false);
	const [error, setError] = createSignal<Error>();
	let runId = 0;

	const value: Accessor<T> = () => (hasOverride() ? (override() as T) : read(source));

	const apply = async (patch: T | ((current: T) => T)): Promise<boolean> => {
		const id = ++runId;
		const previous = value();
		const next = typeof patch === "function" ? (patch as (current: T) => T)(previous) : patch;
		setOverride(() => next);
		setHasOverride(true);
		setError(undefined);

		const commit = options?.commit;
		if (!commit) return true;

		setPending(true);
		try {
			await commit(next);
			if (id === runId) setPending(false);
			return true;
		} catch (e) {
			if (id === runId) {
				setOverride(() => previous);
				setPending(false);
				setError(e as Error);
			}
			return false;
		}
	};

	return { value, apply, pending, error };
}
