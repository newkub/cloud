import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface AbortReasonControls<R = unknown> {
	/** AbortSignal for fetch/stream consumers. */
	signal: AbortSignal;
	/** Why it was aborted — the value passed to `abort()`. */
	reason: Accessor<R | undefined>;
	/** Whether aborted. */
	aborted: Accessor<boolean>;
	/** Abort with a typed reason. */
	abort: (reason?: R) => void;
}

/**
 * AbortController wrapper that exposes the abort `reason` reactively — lets UI
 * distinguish "user cancelled" from "timeout" vs generic AbortError.
 *
 * @returns `{ signal, reason, aborted, abort }`
 *
 * @example
 * const a = useAbortReason<string>();
 * fetch(url, { signal: a.signal });
 * a.abort("user-cancelled"); // a.reason() === "user-cancelled"
 */
export function useAbortReason<R = unknown>(): AbortReasonControls<R> {
	const controller = new AbortController();
	const [reason, setReason] = createSignal<R | undefined>(undefined);
	const [aborted, setAborted] = createSignal(false);
	const abort = (r?: R) => {
		if (aborted()) return;
		setReason(() => r);
		setAborted(true);
		controller.abort(r);
	};
	onCleanup(() => {
		if (!aborted()) controller.abort();
	});
	return { signal: controller.signal, reason, aborted, abort };
}
