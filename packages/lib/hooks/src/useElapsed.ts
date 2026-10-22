import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface ElapsedControls {
	/** Milliseconds elapsed since start, excluding stopped time */
	elapsed: Accessor<number>;
	/** True while the timer is running */
	running: Accessor<boolean>;
	/** Start or resume the clock — no-op while already running */
	start: () => void;
	/** Freeze the clock, keeping `elapsed` */
	stop: () => void;
	/** Zero the clock — keeps the current run state */
	reset: () => void;
}

/**
 * Elapsed-time meter — `elapsed` counts milliseconds since `start()`,
 * refreshes on an interval, and pauses cleanly with `stop()`/`start()`.
 * Time is measured with `Date.now()` so the displayed value stays correct
 * even when ticks are delayed or throttled.
 * SSR-safe: stays at 0 until the first tick after mount.
 *
 * @param options — `intervalMs` refresh rate, `autoStart` to arm on mount
 * @returns `{ elapsed, running, start, stop, reset }`
 *
 * @example
 * const t = useElapsed({ intervalMs: 250 });
 * <p>{(t.elapsed() / 1000).toFixed(1)}s</p>
 * <button onClick={t.running() ? t.stop : t.start}>{t.running() ? "stop" : "start"}</button>
 */
export function useElapsed(options?: {
	/** Refresh rate in milliseconds. @default 100 */
	intervalMs?: number;
	/** Begin counting on mount. @default true */
	autoStart?: boolean;
}): ElapsedControls {
	const [elapsed, setElapsed] = createSignal(0);
	const [running, setRunning] = createSignal(false);
	let accumulated = 0;
	let startedAt = 0;
	let timer: ReturnType<typeof setInterval> | undefined;

	const clear = () => {
		clearInterval(timer);
		timer = undefined;
	};

	const tick = () => setElapsed(accumulated + (Date.now() - startedAt));

	const start = () => {
		if (running()) return;
		startedAt = Date.now();
		setRunning(true);
		timer = setInterval(tick, options?.intervalMs ?? 100);
	};

	const stop = () => {
		if (!running()) return;
		clear();
		accumulated += Date.now() - startedAt;
		setElapsed(accumulated);
		setRunning(false);
	};

	const reset = () => {
		accumulated = 0;
		startedAt = Date.now();
		setElapsed(0);
	};

	onMount(() => {
		if (options?.autoStart !== false) start();
		onCleanup(clear);
	});

	return { elapsed, running, start, stop, reset };
}
