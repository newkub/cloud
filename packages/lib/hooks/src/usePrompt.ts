import { type Accessor, createSignal } from "solid-js";

/** Options for {@link usePrompt}. */
export interface PromptOptions {
	/** Starting text of the prompt input. @default "" */
	initialValue?: string;
}

/** State and controls returned by {@link usePrompt}. */
export interface PromptState {
	/** True while an input promise is awaiting a settle. */
	isRevealed: Accessor<boolean>;
	/** Current prompt text (bind an `<input>` to this). */
	value: Accessor<string>;
	/** Ask for text; resolves on `confirm()`, rejects with an `Error` on `cancel()`. */
	input: () => Promise<string>;
	/** Like `input()` but `cancel()` resolves with `defaultValue` instead of rejecting. */
	inputOrDefault: (defaultValue: string) => Promise<string>;
	/** Like `input()` but `cancel()` resolves with `undefined` instead of rejecting. */
	inputOrReject: () => Promise<string | undefined>;
	/** Update the current prompt text. */
	setValue: (v: string) => void;
	/** Settle the pending input with the current value; `cb` (if given) receives it. */
	confirm: (cb?: (value: string) => void) => void;
	/** Settle the pending input as a cancellation (reject / default / undefined). */
	cancel: () => void;
}

/**
 * Promise-based text prompt controller — the string twin of
 * `useConfirmDialog`. `input()` reveals the prompt; `confirm()` resolves it
 * with the current `value()`, `cancel()` honors the chosen variant
 * (`input` rejects, `inputOrDefault` resolves the fallback, `inputOrReject`
 * resolves `undefined`).
 *
 * @param options — `initialValue` seeds the text signal
 * @returns `{ isRevealed, value, input, inputOrDefault, inputOrReject, setValue, confirm, cancel }`
 *
 * @example
 * const prompt = usePrompt({ initialValue: "" });
 * const name = await prompt.input(); // rejects when cancelled
 * <input value={prompt.value()} onInput={(e) => prompt.setValue(e.currentTarget.value)} />
 * <button onClick={() => prompt.confirm()}>OK</button>
 */
export function usePrompt(options?: PromptOptions): PromptState {
	const [isRevealed, setRevealed] = createSignal(false);
	const [value, setValue] = createSignal(options?.initialValue ?? "");
	let settle: ((kind: "confirm" | "cancel") => void) | undefined;

	const start = <T>(onConfirm: (v: string) => T, onCancel: () => T): Promise<T> =>
		new Promise<T>((resolve, reject) => {
			setRevealed(true);
			settle = (kind) => {
				settle = undefined;
				setRevealed(false);
				if (kind === "confirm") {
					resolve(onConfirm(value()));
					return;
				}
				try {
					resolve(onCancel());
				} catch (error) {
					reject(error);
				}
			};
		});

	const cancelRejected = () => {
		throw new Error("[usePrompt] cancelled");
	};

	return {
		isRevealed,
		value,
		input: () => start<string>((v) => v, cancelRejected),
		inputOrDefault: (defaultValue) =>
			start<string>(
				(v) => v,
				() => defaultValue,
			),
		inputOrReject: () =>
			start<string | undefined>(
				(v) => v,
				() => undefined,
			),
		setValue,
		confirm: (cb) => {
			const v = value();
			if (settle) settle("confirm");
			cb?.(v);
		},
		cancel: () => settle?.("cancel"),
	};
}
