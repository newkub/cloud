import { type Accessor, createSignal } from "solid-js";

export interface ParallelProgress {
	/** Tasks settled so far */
	completed: number;
	/** Tasks scheduled for the current run */
	total: number;
}

export interface ParallelState<T> {
	/** Per-task results — `undefined` for tasks that failed or have not run yet */
	results: Accessor<(T | undefined)[]>;
	/** Per-task errors — `undefined` for tasks that succeeded or have not run yet */
	errors: Accessor<(Error | undefined)[]>;
	/** `{ completed, total }` for the current/last run */
	progress: Accessor<ParallelProgress>;
	/**
	 * Execute all tasks with bounded concurrency — resolves with the results
	 * array once every task settles. Re-entrant calls return the current results.
	 */
	run: () => Promise<(T | undefined)[]>;
	running: Accessor<boolean>;
}

/**
 * Run a list of async tasks with a concurrency cap — tracks per-task
 * results/errors and `{ completed, total }` progress. A `run` while one is
 * in flight is a no-op.
 *
 * @param tasks — Array of thunks, each returning a promise
 * @param options — `concurrency` limits simultaneous tasks. @default tasks.length
 * @returns `{ results, errors, progress, run, running }`
 *
 * @example
 * const jobs = useParallel(urls.map(u => () => fetch(u).then(r => r.json())), { concurrency: 3 });
 * <progress value={jobs.progress().completed} max={jobs.progress().total} />
 */
export function useParallel<T>(tasks: Array<() => Promise<T>>, options?: { concurrency?: number }): ParallelState<T> {
	const [results, setResults] = createSignal<(T | undefined)[]>([]);
	const [errors, setErrors] = createSignal<(Error | undefined)[]>([]);
	const [progress, setProgress] = createSignal<ParallelProgress>({ completed: 0, total: tasks.length });
	const [running, setRunning] = createSignal(false);

	const run = async () => {
		if (running()) return results();
		setRunning(true);
		setResults(tasks.map(() => undefined));
		setErrors(tasks.map(() => undefined));
		setProgress({ completed: 0, total: tasks.length });
		const limit = Math.max(1, Math.min(options?.concurrency ?? tasks.length, tasks.length || 1));
		let next = 0;
		const worker = async () => {
			while (next < tasks.length) {
				const i = next;
				next += 1;
				const task = tasks[i];
				if (!task) continue;
				try {
					const value = await task();
					setResults((rs) => rs.map((r, j) => (j === i ? value : r)));
				} catch (e) {
					setErrors((es) => es.map((err, j) => (j === i ? (err ?? (e as Error)) : err)));
				} finally {
					setProgress((p) => ({ ...p, completed: p.completed + 1 }));
				}
			}
		};
		await Promise.all(Array.from({ length: limit }, worker));
		setRunning(false);
		return results();
	};

	return { results, errors, progress, run, running };
}
