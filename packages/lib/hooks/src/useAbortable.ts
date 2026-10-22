import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface AbortableControls {
	/** Current signal — pass to `fetch`/async work; tracks `reset()` */
	signal: Accessor<AbortSignal>;
	/** Abort the current controller — the signal stays aborted until `reset()` */
	abort: (reason?: unknown) => void;
	/** Abort the current controller and mint a fresh one — returns the new signal */
	reset: () => AbortSignal;
}

/**
 * Minimal lifecycle-managed AbortController — a reactive `signal` you hand to
 * abortable work, `abort()` to cancel it, and `reset()` to mint a fresh
 * controller after aborting. The controller is aborted automatically on
 * unmount so in-flight work is cancelled.
 * SSR-safe: where `AbortController` is unavailable the signal stays `undefined`
 * at runtime and `abort`/`reset` no-op.
 *
 * @returns `{ signal, abort, reset }`
 *
 * @example
 * const ctl = useAbortable();
 * fetch("/api/data", { signal: ctl.signal() });
 * <button onClick={() => ctl.abort()}>cancel</button>
 */
export function useAbortable(): AbortableControls {
	const [inner, setInner] = createSignal<AbortSignal>();
	let ctrl: AbortController | undefined;

	const make = (): AbortSignal | undefined => {
		ctrl = typeof AbortController === "undefined" ? undefined : new AbortController();
		setInner(() => ctrl?.signal);
		return ctrl?.signal;
	};

	make();

	onCleanup(() => ctrl?.abort());

	return {
		signal: (() => inner() ?? make()) as Accessor<AbortSignal>,
		abort: (reason?: unknown) => {
			if (!ctrl || ctrl.signal.aborted) return;
			ctrl.abort(reason);
		},
		reset: () => {
			ctrl?.abort();
			return make() as AbortSignal;
		},
	};
}
