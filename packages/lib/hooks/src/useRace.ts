import { type Accessor, createEffect, createSignal } from "solid-js";

export interface RaceState<T> {
	/** Value produced by the winning promise — `undefined` until one settles */
	result: Accessor<T | undefined>;
	/** Index into the promise array of the first settled promise — `-1` before any settles */
	winnerIndex: Accessor<number>;
	/** True once one promise from the current list has won the race */
	settled: Accessor<boolean>;
	/** Rejection reason when the winning promise rejected */
	error: Accessor<unknown>;
	/** True while a race is in progress */
	pending: Accessor<boolean>;
}

/**
 * Races a reactive list of promises — the first promise to settle wins:
 * `result()`/`error()` take its settled value and `winnerIndex()` reports
 * its position. When `promises()` produces a new list the race restarts and
 * stragglers from previous lists are ignored (latest-wins).
 *
 * @param promises — Accessor for the array of promises to race
 * @returns `{ result, winnerIndex, settled, error, pending }`
 *
 * @example
 * const race = useRace(() => [fetchA(), fetchB()]);
 * <p>{race.settled() ? `mirror ${race.winnerIndex()} won` : "racing…"}</p>
 */
export function useRace<T>(promises: Accessor<Promise<T>[]>): RaceState<T> {
	const [result, setResult] = createSignal<T>();
	const [winnerIndex, setWinnerIndex] = createSignal(-1);
	const [settled, setSettled] = createSignal(false);
	const [error, setError] = createSignal<unknown>();
	const [pending, setPending] = createSignal(false);
	let runId = 0;

	createEffect(() => {
		const list = promises();
		const id = ++runId;
		setSettled(false);
		setWinnerIndex(-1);
		setError(undefined);
		if (list.length === 0) {
			setPending(false);
			return;
		}
		setPending(true);
		let won = false;
		list.forEach((p, index) => {
			Promise.resolve(p).then(
				(value) => {
					if (id !== runId || won) return;
					won = true;
					setWinnerIndex(index);
					setResult(() => value);
					setError(undefined);
					setSettled(true);
					setPending(false);
				},
				(reason) => {
					if (id !== runId || won) return;
					won = true;
					setWinnerIndex(index);
					setError(reason);
					setSettled(true);
					setPending(false);
				},
			);
		});
	});

	return { result, winnerIndex, settled, error, pending };
}
