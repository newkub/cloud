import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface StreamState<T = unknown> {
	/** Every chunk read so far, in arrival order — resets when the source stream changes */
	data: Accessor<readonly T[]>;
	/** True once the stream is exhausted or `cancel()` was called */
	done: Accessor<boolean>;
	/** Last reader error message — `undefined` for a clean `cancel()` */
	error: Accessor<string | undefined>;
	/** Cancel the pending read loop and mark `done` — safe to call twice */
	cancel: (reason?: unknown) => void;
}

/**
 * Consume a `ReadableStream` into signals — chunks accumulate into `data()`
 * in order, `done()` flips when the stream closes, reader failures land in
 * `error()`. Reactive: pass an accessor and the reader re-attaches when the
 * stream identity changes, cancelling the previous reader. The active reader
 * is cancelled on cleanup.
 *
 * @param source — `ReadableStream` or accessor resolving to one
 * @returns `{ data, done, error, cancel }`
 *
 * @example
 * const { data, done } = useStream(() => response()?.body);
 * <For each={data()}>{(chunk) => <ChunkView chunk={chunk} />}</For>
 */
export function useStream<T>(source: MaybeAccessor<ReadableStream<T> | undefined>): StreamState<T> {
	const [data, setData] = createSignal<readonly T[]>([]);
	const [done, setDone] = createSignal(false);
	const [error, setError] = createSignal<string>();
	let reader: ReadableStreamDefaultReader<T> | undefined;

	const release = (r: ReadableStreamDefaultReader<T>) => {
		if (reader === r) reader = undefined;
		try {
			r.releaseLock();
		} catch {
			/* already released */
		}
	};

	const cancel = (reason?: unknown) => {
		const r = reader;
		reader = undefined;
		setDone(true);
		if (!r) return;
		void r.cancel(reason).catch(() => {});
		release(r);
	};

	createEffect(() => {
		const stream = read(source);
		setData([]);
		setDone(false);
		setError(undefined);
		if (!stream) return;
		let cancelled = false;
		const r = stream.getReader();
		reader = r;
		void (async () => {
			try {
				for (;;) {
					const { value, done: finished } = await r.read();
					if (cancelled) break;
					if (finished) {
						setDone(true);
						break;
					}
					setData((prev) => [...prev, value]);
				}
			} catch (e) {
				if (!cancelled) setError(e instanceof Error ? e.message : String(e));
			} finally {
				release(r);
			}
		})();
		onCleanup(() => {
			cancelled = true;
			if (reader === r) reader = undefined;
			void r.cancel().catch(() => {});
		});
	});

	return { data, done, error, cancel };
}
