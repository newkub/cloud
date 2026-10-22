import { type Accessor, createSignal } from "solid-js";

export type MutationStatus = "idle" | "pending" | "success" | "error";

export interface MutationState<TArgs, TResult> {
	status: Accessor<MutationStatus>;
	data: Accessor<TResult | undefined>;
	error: Accessor<Error | undefined>;
	/** Run the async action — resolves with the result, never throws */
	mutate: (args: TArgs) => Promise<TResult | undefined>;
	reset: () => void;
}

/**
 * Async action state machine — pending/success/error + result + reset.
 * `mutate` resolves with the result or `undefined` on failure — never throws.
 * `onSuccess`/`onError`/`onSettled` callbacks fire per call.
 *
 * @param fn — Async action to run
 * @param options — Lifecycle callbacks
 * @returns `{ status, data, error, mutate, reset }`
 *
 * @example
 * const save = useMutation((doc: Doc) => api.save(doc), { onSuccess: () => toast("saved") });
 * <button disabled={save.status() === "pending"} onClick={() => save.mutate(doc)}>Save</button>
 */
export function useMutation<TArgs = void, TResult = unknown>(
	fn: (args: TArgs) => Promise<TResult>,
	options?: {
		/** Called after a successful mutation with the result and args. */
		onSuccess?: (data: TResult, args: TArgs) => void;
		/** Called after a failed mutation with the error and args. */
		onError?: (error: Error, args: TArgs) => void;
		/** Called after every mutation — `data` xor `error` is set. */
		onSettled?: (data: TResult | undefined, error: Error | undefined, args: TArgs) => void;
	},
): MutationState<TArgs, TResult> {
	const [status, setStatus] = createSignal<MutationStatus>("idle");
	const [data, setData] = createSignal<TResult>();
	const [error, setError] = createSignal<Error>();

	const mutate = async (args: TArgs) => {
		setStatus("pending");
		try {
			const result = await fn(args);
			setData(() => result);
			setStatus("success");
			options?.onSuccess?.(result, args);
			options?.onSettled?.(result, undefined, args);
			return result;
		} catch (e) {
			const err = e as Error;
			setError(err);
			setStatus("error");
			options?.onError?.(err, args);
			options?.onSettled?.(undefined, err, args);
			return undefined;
		}
	};

	const reset = () => {
		setStatus("idle");
		setData(undefined);
		setError(undefined);
	};

	return { status, data, error, mutate, reset };
}
