import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export type PromiseStatus = "idle" | "pending" | "resolved" | "rejected";

export interface PromiseStatusState<T> {
	/** Lifecycle state of the current promise — `"idle"` when no promise is set */
	status: Accessor<PromiseStatus>;
	/** Resolved value — cleared each time a new promise starts */
	value: Accessor<T | undefined>;
	/** Rejection reason — cleared each time a new promise starts */
	error: Accessor<unknown>;
}

/**
 * Track a promise produced by an accessor — `status` moves through
 * `"pending"` → `"resolved"`/`"rejected"` and back to `"idle"` when the
 * source returns `null`/`undefined`. Stale results are ignored: when the
 * source yields a new promise, the previous one's settle handlers are
 * cancelled via cleanup.
 *
 * @param source — Accessor returning the promise to watch
 * @returns `{ status, value, error }` accessors
 *
 * @example
 * const [query, setQuery] = createSignal(fetchUser());
 * const p = usePromiseStatus(query);
 * <Show when={p.status() === "resolved"}>{p.value()!.name}</Show>
 */
export function usePromiseStatus<T>(source: Accessor<Promise<T> | null | undefined>): PromiseStatusState<T> {
	const [status, setStatus] = createSignal<PromiseStatus>("idle");
	const [value, setValue] = createSignal<T>();
	const [error, setError] = createSignal<unknown>(undefined);

	createEffect(() => {
		const promise = source();
		if (!promise) {
			setStatus("idle");
			setValue(undefined);
			setError(undefined);
			return;
		}
		setStatus("pending");
		setValue(undefined);
		setError(undefined);
		let alive = true;
		promise.then(
			(v) => {
				if (!alive) return;
				setValue(() => v);
				setStatus("resolved");
			},
			(e) => {
				if (!alive) return;
				setError(e);
				setStatus("rejected");
			},
		);
		onCleanup(() => {
			alive = false;
		});
	});

	return { status, value, error };
}
