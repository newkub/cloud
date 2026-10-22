import { type Accessor, createSignal } from "solid-js";

export interface SubmitState<TValues> {
	/**
	 * Invoke the handler — calls `preventDefault()` when passed a submit
	 * event, then awaits `handler(values)`. Re-entrant calls while `pending`
	 * are ignored. Never throws — failures land in `error`.
	 */
	submit: (e?: { preventDefault?: () => void } | null, values?: TValues) => Promise<void>;
	/** True while the handler is in flight. */
	pending: Accessor<boolean>;
	/** Last handler error. */
	error: Accessor<Error | undefined>;
	/** True after the last run completed without throwing. */
	succeeded: Accessor<boolean>;
	/** Clear `error`/`succeeded` back to idle. */
	reset: () => void;
}

/**
 * Form-submit state machine — wraps an async handler with `pending`,
 * `error`, `succeeded` and a `submit(e?, values)` fn that prevent-defaults
 * native submit events and swallows rejections into `error`.
 *
 * @param handler — Async action receiving the submitted values
 * @returns `{ submit, pending, error, succeeded, reset }`
 *
 * @example
 * const send = useSubmit(async (v: FormValues) => api.post("/contact", v));
 * <form onSubmit={(e) => send.submit(e, form.values())}>
 *   <button disabled={send.pending()}>{send.pending() ? "sending…" : "send"}</button>
 * </form>
 */
export function useSubmit<TValues = undefined>(
	handler: (values: TValues) => void | Promise<void>,
): SubmitState<TValues> {
	const [pending, setPending] = createSignal(false);
	const [error, setError] = createSignal<Error>();
	const [succeeded, setSucceeded] = createSignal(false);

	const submit = async (e?: { preventDefault?: () => void } | null, values?: TValues) => {
		e?.preventDefault?.();
		if (pending()) return;
		setPending(true);
		setError(undefined);
		setSucceeded(false);
		try {
			await handler(values as TValues);
			setSucceeded(true);
		} catch (err) {
			setError(err as Error);
		} finally {
			setPending(false);
		}
	};

	const reset = () => {
		setError(undefined);
		setSucceeded(false);
	};

	return { submit, pending, error, succeeded, reset };
}
