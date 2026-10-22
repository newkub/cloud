import { type Accessor, createEffect, createRoot, createSignal, on, onCleanup } from "solid-js";

/** Options for {@link useTriggerableWatch}. */
export interface TriggerableWatchOptions {
	/** Invoke the callback once immediately with the current value. @default false */
	immediate?: boolean;
}

/** Controls returned by {@link useTriggerableWatch}. */
export interface TriggerableWatchState {
	/** Drop change emissions until `resume()`. */
	pause: () => void;
	/** Let change emissions through again. */
	resume: () => void;
	/** Manually run the callback once with the current value — even while paused. */
	trigger: () => void;
	/** `false` between `pause()` and `resume()`. */
	isActive: Accessor<boolean>;
}

/**
 * Pausable watcher with a manual `trigger()` escape hatch (VueUse
 * `triggerableWatch`): natural changes are swallowed while paused, but
 * `trigger()` always re-runs the callback with the current value and updates
 * the `previous` reference for the next emission.
 *
 * @param source — Accessor to observe
 * @param callback — `(value, previous)` on each delivered change or trigger
 * @param options — `immediate` fires once at setup
 * @returns `{ pause, resume, trigger, isActive }`
 *
 * @example
 * const w = useTriggerableWatch(query, (q) => search(q));
 * w.pause();            // ignore typing churn
 * w.trigger();          // …but re-search on demand
 * w.resume();
 */
export function useTriggerableWatch<T>(
	source: Accessor<T>,
	callback: (value: T, previous: T | undefined) => void,
	options?: TriggerableWatchOptions,
): TriggerableWatchState {
	const [isActive, setActive] = createSignal(true);
	let last: T | undefined = options?.immediate ? undefined : source();
	let alive = true;

	const emit = (value: T) => {
		if (!alive) return;
		const previous = last;
		last = value;
		callback(value, previous);
	};

	const dispose = createRoot((d) => {
		onCleanup(() => {
			alive = false;
		});
		createEffect(
			on(
				source,
				(value) => {
					if (!isActive()) return;
					emit(value);
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
		trigger: () => emit(source()),
		isActive,
	};
}
