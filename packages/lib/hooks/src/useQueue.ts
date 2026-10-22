import { type Accessor, createSignal } from "solid-js";

export interface QueueControls<T> {
	/** Reactive snapshot — front of the queue first */
	items: Accessor<T[]>;
	/** Append values to the back */
	enqueue: (...values: T[]) => void;
	/** Remove and return the front value — undefined when empty */
	dequeue: () => T | undefined;
	/** Read the front value without removing it */
	peek: () => T | undefined;
	/** Reactive count */
	size: Accessor<number>;
	/** Remove all values */
	clear: () => void;
}

/**
 * First-in-first-out queue backed by a signal — `enqueue` appends, `dequeue`
 * removes from the front.
 *
 * @param initial — Seed values, front first. @default empty
 * @returns `{ items, enqueue, dequeue, peek, size, clear }`
 *
 * @example
 * const jobs = useQueue<Job>();
 * jobs.enqueue(job);
 * const next = jobs.dequeue();
 */
export function useQueue<T>(initial?: Iterable<T>): QueueControls<T> {
	const [items, setItems] = createSignal<T[]>([...(initial ?? [])]);
	return {
		items,
		enqueue: (...values) => setItems((q) => [...q, ...values]),
		dequeue: () => {
			const q = items();
			if (q.length === 0) return undefined;
			setItems(q.slice(1));
			return q[0];
		},
		peek: () => items()[0],
		size: () => items().length,
		clear: () => setItems([]),
	};
}
