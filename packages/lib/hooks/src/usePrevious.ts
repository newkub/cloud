import { type Accessor, createMemo, createSignal } from "solid-js";

/** Accessor for the previous value, with a `history` of earlier values attached. */
export type PreviousAccessor<T> = Accessor<T | undefined> & {
	/** Earlier values, most recent first — `history()[0]` always mirrors `prev()` */
	history: Accessor<T[]>;
};

/**
 * Accessor for the previous value of a source — undefined on first run.
 * The returned accessor also exposes `history()` holding earlier values
 * (most recent first), capped by `depth` when provided.
 *
 * @param source — Accessor to track
 * @param options — `depth` caps how many earlier values `history()` keeps
 * @returns Accessor for the last value before the current one, with `.history`
 *
 * @example
 * const prev = usePrevious(count, { depth: 3 });
 * <p>was {prev()}, now {count()} — earlier: {prev.history().join(", ")}</p>
 */
export function usePrevious<T>(
	source: Accessor<T>,
	options?: {
		/** Maximum number of earlier values kept in `history()`. */
		depth?: number;
	},
): PreviousAccessor<T> {
	const [prev, setPrev] = createSignal<T | undefined>(undefined);
	const [history, setHistory] = createSignal<T[]>([]);
	let last: T | undefined;
	let seen = false;
	createMemo(() => {
		const current = source();
		if (!seen) {
			seen = true;
			last = current;
			return;
		}
		if (current !== last) {
			const outgoing = last;
			setHistory((h) => {
				const next = [outgoing as T, ...h];
				const depth = options?.depth;
				return depth !== undefined && next.length > depth ? next.slice(0, depth) : next;
			});
			setPrev(() => outgoing);
			last = current;
		}
	});
	return Object.assign(prev, { history });
}
