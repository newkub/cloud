import { type Accessor, createSignal } from "solid-js";

export interface FieldOptions<T> {
	/** Return an error message, or `undefined` when valid. Runs on `blur()` and `validate()`. */
	validate?: (value: T) => string | undefined;
}

export interface FieldState<T> {
	/** Current value. */
	value: Accessor<T>;
	/** Set the value — marks the field dirty when it differs from the initial value. */
	set: (value: T) => void;
	/** Last validation error — cleared automatically when the value changes. */
	error: Accessor<string | undefined>;
	/** True after `blur()`. */
	touched: Accessor<boolean>;
	/** True when `value` differs from the initial value. */
	dirty: Accessor<boolean>;
	/** Restore the initial value and clear error/touched/dirty. */
	reset: () => void;
	/** Run `options.validate` — stores the message and returns true when valid. */
	validate: () => boolean;
	/** Mark touched and validate — wire to `onBlur`. */
	blur: () => void;
}

/**
 * Single-field state — value + touched/dirty flags + validate-on-blur.
 * `error` clears on every `set` so stale messages never linger while typing.
 *
 * @param initial — Initial value
 * @param options — `validate` returns an error message or `undefined`
 * @returns `{ value, set, error, touched, dirty, reset, validate, blur }`
 *
 * @example
 * const email = useField("", { validate: (v) => (v.includes("@") ? undefined : "invalid email") });
 * <input value={email.value()} onInput={(e) => email.set(e.currentTarget.value)} onBlur={email.blur} />
 * <Show when={email.touched() && email.error()}><p>{email.error()}</p></Show>
 */
export function useField<T>(initial: T, options?: FieldOptions<T>): FieldState<T> {
	const [value, setValue] = createSignal(initial);
	const [error, setError] = createSignal<string | undefined>();
	const [touched, setTouched] = createSignal(false);
	const [dirty, setDirty] = createSignal(false);

	const set = (next: T) => {
		setValue(() => next);
		setDirty(next !== initial);
		setError(undefined);
	};

	const validate = () => {
		const message = options?.validate?.(value());
		setError(message);
		return message === undefined;
	};

	const blur = () => {
		setTouched(true);
		validate();
	};

	const reset = () => {
		setValue(() => initial);
		setError(undefined);
		setTouched(false);
		setDirty(false);
	};

	return { value, set, error, touched, dirty, reset, validate, blur };
}
