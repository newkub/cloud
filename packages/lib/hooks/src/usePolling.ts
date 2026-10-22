import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface PollingState<T> {
	data: Accessor<T | undefined>;
	error: Accessor<Error | undefined>;
	/** Epoch ms of the last successful poll */
	lastUpdated: Accessor<number | undefined>;
	paused: Accessor<boolean>;
	pause: () => void;
	resume: () => void;
	/** Poll once right now — ignores `paused` and tab visibility */
	refresh: () => void;
}

/**
 * Poll an async function on an interval — pauses while the tab is hidden
 * (unless `runWhileHidden`) and while `pause()`d. A manual pause is not
 * overridden by visibility changes.
 *
 * @param fn — Async function to poll
 * @param ms — Interval in milliseconds
 * @param options — `immediate` fetches on mount; `runWhileHidden` keeps polling in background tabs
 * @returns `{ data, error, lastUpdated, paused, pause, resume, refresh }`
 *
 * @example
 * const stats = usePolling(() => fetch("/api/stats").then(r => r.json()), 5000);
 */
export function usePolling<T>(
	fn: () => Promise<T>,
	ms: number,
	options?: {
		/** Fetch immediately on mount. @default true */
		immediate?: boolean;
		/** Keep polling while the tab is hidden. @default false */
		runWhileHidden?: boolean;
	},
): PollingState<T> {
	const [data, setData] = createSignal<T>();
	const [error, setError] = createSignal<Error>();
	const [lastUpdated, setLastUpdated] = createSignal<number>();
	const [paused, setPaused] = createSignal(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	const tick = () => {
		if (document.hidden && !(options?.runWhileHidden ?? false)) return;
		fn()
			.then((d) => {
				setData(() => d);
				setError(undefined);
				setLastUpdated(Date.now());
			})
			.catch((e) => setError(e as Error));
	};

	const start = () => {
		if (timer === undefined) timer = setInterval(tick, ms);
	};
	const stop = () => {
		clearInterval(timer);
		timer = undefined;
	};

	onMount(() => {
		if (options?.immediate !== false) tick();
		start();
		const vis = () => {
			if (document.hidden) {
				if (!options?.runWhileHidden) stop();
			} else if (!paused()) {
				start();
			}
		};
		document.addEventListener("visibilitychange", vis);
		onCleanup(() => {
			stop();
			document.removeEventListener("visibilitychange", vis);
		});
	});

	return {
		data,
		error,
		lastUpdated,
		paused,
		pause: () => {
			stop();
			setPaused(true);
		},
		resume: () => {
			start();
			setPaused(false);
		},
		refresh: () => {
			fn()
				.then((d) => {
					setData(() => d);
					setError(undefined);
					setLastUpdated(Date.now());
				})
				.catch((e) => setError(e as Error));
		},
	};
}
