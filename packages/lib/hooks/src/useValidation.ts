import { type Accessor, createMemo } from "solid-js";

/** Object rule — `test` returns true when valid, `message` shown on failure. */
export interface ValidationTest<T = unknown> {
	test(value: T): boolean;
	message: string;
}

/**
 * A rule is either `{ test, message }` or a function returning an error
 * message (`string`), `false` (generic failure), or `true`/`undefined`/`null`
 * (pass).
 */
export type ValidationRule<T = unknown> = ValidationTest<T> | ((value: T) => string | boolean | undefined | null);

/** Evaluate a single rule — returns the error message or `undefined` when valid. */
export function testRule<T>(rule: ValidationRule<T>, value: T): string | undefined {
	if (typeof rule === "function") {
		const result = rule(value);
		if (typeof result === "string") return result;
		return result === false ? "Invalid value" : undefined;
	}
	return rule.test(value) ? undefined : rule.message;
}

export interface ValidationState {
	/** All current error messages. */
	errors: Accessor<string[]>;
	/** First error message, if any. */
	firstError: Accessor<string | undefined>;
	/** True when every rule passes. */
	valid: Accessor<boolean>;
	/** Re-run all rules — returns `valid`. */
	validate: () => boolean;
}

/**
 * Live rule evaluation against a reactive value — `errors`/`valid` update
 * whenever `value` changes. Combine with `useField.touched` (or your own
 * flag) to delay display until after interaction.
 *
 * @param value — Accessor holding the value to validate
 * @param rules — Rules evaluated in order; a function returns the message on failure
 * @returns `{ errors, firstError, valid, validate }`
 *
 * @example
 * const [pw, setPw] = createSignal("");
 * const v = useValidation(pw, [
 *   { test: (v) => v.length >= 8, message: "min 8 chars" },
 *   (v) => (/\d/.test(v) ? undefined : "needs a digit"),
 * ]);
 * <Show when={!v.valid()}><p>{v.firstError()}</p></Show>
 */
export function useValidation<T>(value: Accessor<T>, rules: readonly ValidationRule<T>[]): ValidationState {
	const errors = createMemo(() => {
		const v = value();
		const out: string[] = [];
		for (const rule of rules) {
			const message = testRule(rule, v);
			if (message !== undefined) out.push(message);
		}
		return out;
	});
	const firstError = createMemo(() => errors()[0]);
	const valid = createMemo(() => errors().length === 0);
	return { errors, firstError, valid, validate: () => valid() };
}
