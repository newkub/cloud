import { onCleanup } from "solid-js";

export interface Scheduler {
	/**
	 * `setInterval` — runs `fn` every `ms`. Returns a dispose function;
	 * also cancelled by `cancelAll()` and on unmount.
	 */
	every: (ms: number, fn: () => void) => () => void;
	/**
	 * One-shot timer at an absolute `timestamp` (epoch ms or Date).
	 * Fires immediately when the timestamp is in the past.
	 */
	at: (timestamp: number | Date, fn: () => void) => () => void;
	/** Cancel every pending interval and timeout */
	cancelAll: () => void;
}

/**
 * Declarative timers — `every` for intervals, `at` for absolute one-shots.
 * Each call returns a dispose function; everything is cancelled on unmount
 * so callbacks never fire on a disposed component.
 *
 * @returns `{ every, at, cancelAll }`
 *
 * @example
 * const clock = useScheduler();
 * clock.every(1000, () => setNow(Date.now()));
 * clock.at(deadline, () => setExpired(true));
 */
export function useScheduler(): Scheduler {
	const intervalIds = new Set<ReturnType<typeof setInterval>>();
	const timeoutIds = new Set<ReturnType<typeof setTimeout>>();

	const every = (ms: number, fn: () => void) => {
		const id = setInterval(fn, ms);
		intervalIds.add(id);
		return () => {
			clearInterval(id);
			intervalIds.delete(id);
		};
	};

	const at = (timestamp: number | Date, fn: () => void) => {
		const target = typeof timestamp === "number" ? timestamp : timestamp.getTime();
		const id = setTimeout(
			() => {
				timeoutIds.delete(id);
				fn();
			},
			Math.max(0, target - Date.now()),
		);
		timeoutIds.add(id);
		return () => {
			clearTimeout(id);
			timeoutIds.delete(id);
		};
	};

	const cancelAll = () => {
		for (const id of intervalIds) clearInterval(id);
		for (const id of timeoutIds) clearTimeout(id);
		intervalIds.clear();
		timeoutIds.clear();
	};

	onCleanup(cancelAll);

	return { every, at, cancelAll };
}
