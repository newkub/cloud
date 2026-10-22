import { type Accessor, createEffect, createMemo, onCleanup } from "solid-js";

/** Result of {@link useCondition}. */
export interface Condition {
	/** True while the predicate holds. */
	met: Accessor<boolean>;
	/** Resolves once the predicate becomes true — resolves immediately if it already is. */
	wait: () => Promise<void>;
}

/**
 * Await a reactive predicate — `met()` tracks it live and `wait()`
 * returns a promise that resolves the next time it turns true. Pending
 * waiters also resolve on cleanup, so a disposed scope never leaves a
 * promise hanging forever.
 *
 * @param predicate — Accessor for the condition
 * @returns `{ met, wait }`
 *
 * @example
 * const ready = useCondition(() => !!engine());
 * await ready.wait(); // resolves when engine initialises
 */
export function useCondition(predicate: Accessor<boolean>): Condition {
	const met = createMemo(() => !!predicate());
	const waiters = new Set<() => void>();
	const flush = () => {
		for (const resolve of [...waiters]) {
			waiters.delete(resolve);
			resolve();
		}
	};
	createEffect(() => {
		if (met()) flush();
	});
	onCleanup(flush);
	return {
		met,
		wait: () => (met() ? Promise.resolve() : new Promise<void>((resolve) => waiters.add(resolve))),
	};
}
