import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * A lagging accessor — call it like a normal `Accessor<T>`. It also carries
 * `lagging()` (true while a newer source value is waiting to land) and
 * `flush()` to apply the pending value immediately.
 */
export type DeferredValue<T> = Accessor<T> & {
	/** True while the deferred value trails the source */
	lagging: Accessor<boolean>;
	/** Apply the latest source value now */
	flush: () => void;
};

/**
 * Deferred copy of a reactive value — the returned accessor always trails the
 * source: every change is applied asynchronously after `timeoutMs`
 * (default: next macrotask), so the deferred value keeps rendering the
 * previous state while updates settle. Rapid changes coalesce — the pending
 * write is reset on each source update and only the latest value lands.
 *
 * @param source — Accessor to defer
 * @param options — `timeoutMs` lag before the deferred value updates. @default 0
 * @returns Accessor that trails the source, with `lagging`/`flush` attached
 *
 * @example
 * const deferredQuery = useDeferred(query, { timeoutMs: 100 });
 * <Results filter={deferredQuery()} stale={deferredQuery.lagging()} />
 */
export function useDeferred<T>(source: Accessor<T>, options?: { timeoutMs?: number }): DeferredValue<T> {
	const [value, setValue] = createSignal(source());
	const [lagging, setLagging] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let latest: T = source();
	let first = true;

	const clear = () => {
		clearTimeout(timer);
		timer = undefined;
		setLagging(false);
	};

	const apply = () => {
		clear();
		const next = latest;
		setValue(() => next);
	};

	createEffect(() => {
		const next = source();
		if (first) {
			first = false;
			return;
		}
		latest = next;
		setLagging(true);
		clearTimeout(timer);
		timer = setTimeout(apply, options?.timeoutMs ?? 0);
	});

	onCleanup(clear);

	return Object.assign(value, { lagging, flush: apply });
}
