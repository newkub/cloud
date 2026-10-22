import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export interface IntervalControls {
	/** True while the interval is running */
	running: Accessor<boolean>;
	/** Start/resume the interval */
	start: () => void;
	/** Pause the interval */
	stop: () => void;
	/** Alias for `stop` */
	pause: () => void;
	/** Alias for `start` */
	resume: () => void;
	/** Reset the tick counter */
	reset: () => void;
	/** Ticks elapsed since start/reset */
	ticks: Accessor<number>;
}

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * `setInterval` as a reactive primitive with start/stop/reset and an optional
 * per-tick callback. `ms` may be an accessor — the interval rebinds when it
 * changes, and `enabled` gates ticking without unmounting.
 *
 * @param ms — Interval in milliseconds, or an accessor returning it
 * @param options — `immediate` starts on mount (default), `enabled` gates ticking, `callback` runs per tick
 * @returns `{ running, start, stop, pause, resume, reset, ticks }` controls + accessors
 *
 * @example
 * const clock = useInterval(1000);
 * useInterval(() => (slow() ? 5000 : 500), { callback: poll, enabled: online });
 */
export function useInterval(
	ms: MaybeAccessor<number>,
	options?: {
		/** Start ticking on mount. @default true */
		immediate?: boolean;
		/** Accessor gate — ticks only while it returns true. @default () => true */
		enabled?: Accessor<boolean>;
		/** Runs on every tick, after `ticks` increments. */
		callback?: () => void;
	},
): IntervalControls {
	const [running, setRunning] = createSignal(false);
	const [ticks, setTicks] = createSignal(0);

	createEffect(() => {
		const delay = read(ms);
		if (!running() || !(options?.enabled?.() ?? true)) return;
		const id = setInterval(() => {
			setTicks((t) => t + 1);
			options?.callback?.();
		}, delay);
		onCleanup(() => clearInterval(id));
	});

	const start = () => setRunning(true);
	const stop = () => setRunning(false);
	const reset = () => setTicks(0);

	onMount(() => {
		if (options?.immediate !== false) start();
	});

	return { running, start, stop, pause: stop, resume: start, reset, ticks };
}
