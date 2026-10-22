import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface AbortControllerState {
	/** Current signal — `undefined` where AbortController is unavailable (SSR) */
	signal: Accessor<AbortSignal | undefined>;
	/** True after `abort()` until `reset()` */
	aborted: Accessor<boolean>;
	/** Abort the current controller */
	abort: (reason?: unknown) => void;
	/** Discard the aborted controller and expose a fresh signal */
	reset: () => AbortSignal | undefined;
}

/**
 * Lifecycle-managed AbortController — the signal is a reactive accessor,
 * `reset()` mints a new controller after aborting, and the controller is
 * aborted automatically on unmount so in-flight work is cancelled.
 *
 * @returns `{ signal, aborted, abort, reset }`
 *
 * @example
 * const ctl = useAbortController();
 * fetch("/api/data", { signal: ctl.signal() });
 * <button onClick={ctl.abort}>cancel</button>
 */
export function useAbortController(): AbortControllerState {
	const [signal, setSignal] = createSignal<AbortSignal>();
	const [aborted, setAborted] = createSignal(false);
	let ctrl: AbortController | undefined;

	const make = () => {
		ctrl = typeof AbortController === "undefined" ? undefined : new AbortController();
		setSignal(() => ctrl?.signal);
		setAborted(false);
		return ctrl?.signal;
	};

	make();

	onCleanup(() => ctrl?.abort());

	return {
		signal,
		aborted,
		abort: (reason?: unknown) => {
			if (!ctrl || ctrl.signal.aborted) return;
			ctrl.abort(reason);
			setAborted(true);
		},
		reset: () => {
			ctrl?.abort();
			return make();
		},
	};
}
