import { type Accessor, createSignal } from "solid-js";

export interface MeasureAsyncControls {
	/** Run an async fn — records its wall-clock duration (ms), rethrows errors, resolves with its value */
	measure: <T>(fn: () => Promise<T>) => Promise<T>;
	/** Duration of the most recent `measure` call — `null` before the first */
	last: Accessor<number | null>;
	/** Every recorded duration, oldest first (capped at 100 entries) */
	history: Accessor<number[]>;
}

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/**
 * Time async work — `measure(fn)` awaits `fn`, stores the elapsed ms in
 * `last` and appends it to `history` (success or failure), then returns or
 * rethrows the original result. When `name` is given each duration is echoed
 * to `console.debug` as `[name] n.nn ms`.
 *
 * @param name — Optional label echoed to `console.debug` with each duration
 * @returns `{ measure, last, history }`
 *
 * @example
 * const m = useMeasureAsync("fetch-user");
 * <button onClick={() => void m.measure(loadUser)}>load</button>
 * <p>last: {m.last()?.toFixed(1)}ms · runs: {m.history().length}</p>
 */
export function useMeasureAsync(name?: string): MeasureAsyncControls {
	const [last, setLast] = createSignal<number | null>(null);
	const [history, setHistory] = createSignal<number[]>([]);

	const record = (ms: number) => {
		setLast(ms);
		setHistory((h) => (h.length >= 100 ? [...h.slice(1), ms] : [...h, ms]));
		if (name && typeof console !== "undefined") console.debug(`[${name}] ${ms.toFixed(2)} ms`);
	};

	const measure = async <T>(fn: () => Promise<T>): Promise<T> => {
		const start = now();
		try {
			return await fn();
		} finally {
			record(now() - start);
		}
	};

	return { measure, last, history };
}
