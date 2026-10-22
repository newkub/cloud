import { type Accessor, createEffect, createRoot, createSignal, on, onCleanup } from "solid-js";

/** Options for {@link usePausableWatch}. */
export interface PausableWatchOptions {
	/** Invoke the callback once immediately with the current value. @default false */
	immediate?: boolean;
}

/** Controls returned by {@link usePausableWatch}. */
export interface PausableWatchState {
	/** Drop emissions until `resume()`. */
	pause: () => void;
	/** Let emissions through again. */
	resume: () => void;
	/** `false` between `pause()` and `resume()`. */
	isActive: Accessor<boolean>;
}

/**
 * Watcher with a pause switch — changes arriving while paused are dropped
 * (not queued). `previous` passed to the callback is the last delivered
 * value, so a change swallowed during the pause makes the next delivered
 * change report the value from before the pause.
 *
 * @param source — Accessor to observe
 * @param callback — `(value, previous)` on each delivered change
 * @param options — `immediate` fires once at setup (while active)
 * @returns `{ pause, resume, isActive }`
 *
 * @example
 * const w = usePausableWatch(price, (p, old) => log(p, old));
 * <button onClick={() => (w.isActive() ? w.pause() : w.resume())}>toggle</button>
 */
export function usePausableWatch<T>(
	source: Accessor<T>,
	callback: (value: T, previous: T | undefined) => void,
	options?: PausableWatchOptions,
): PausableWatchState {
	const [isActive, setActive] = createSignal(true);
	let last: T | undefined = options?.immediate ? undefined : source();

	const dispose = createRoot((d) => {
		createEffect(
			on(
				source,
				(value) => {
					if (!isActive()) return;
					const previous = last;
					last = value;
					callback(value, previous);
				},
				{ defer: !options?.immediate },
			),
		);
		return d;
	});
	onCleanup(dispose);

	return {
		pause: () => setActive(false),
		resume: () => setActive(true),
		isActive,
	};
}
