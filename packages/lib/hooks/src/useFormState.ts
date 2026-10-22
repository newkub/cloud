import { type Accessor, createMemo, createSignal } from "solid-js";
import { testRule, type ValidationRule } from "./useValidation";

/** Per-field spec — `rules` evaluated in order, `validate` is a single-message shortcut. */
export interface FormFieldSpec<T = unknown> {
	/** Initial value. @default "" */
	initial?: T;
	/** Ordered rules — first failure wins. */
	rules?: readonly ValidationRule<T>[];
	/** Return an error message or `undefined` — runs after `rules`. */
	validate?: (value: T) => string | undefined;
}

/** `fields` map entry — a spec object, or a bare rules array as shorthand. */
export type FormField<T = unknown> = FormFieldSpec<T> | readonly ValidationRule<T>[];

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string | undefined>;
export type FormTouched = Record<string, boolean>;

export interface FormState<TFields extends Record<string, FormField>> {
	/** Current value per field name. */
	values: Accessor<FormValues>;
	/** First error message per field name (live — gate display with `touched`). */
	errors: Accessor<FormErrors>;
	/** Blurred/submitted flag per field name. */
	touched: Accessor<FormTouched>;
	/** Set one field's value. */
	set: (name: keyof TFields & string, value: unknown) => void;
	/** Mark a field touched (wire to `onBlur`). */
	blur: (name: keyof TFields & string) => void;
	/** Validate one field — returns true when valid. */
	validate: (name: keyof TFields & string) => boolean;
	/** Validate all fields and mark them touched — returns true when valid. */
	validateAll: () => boolean;
	/** True when no field currently fails its rules. */
	isValid: Accessor<boolean>;
	/** Restore all initial values and clear touched flags. */
	reset: () => void;
	/** Validate all, focus nothing, call `handler(values)` when valid — resolves to validity. */
	submit: (handler: (values: FormValues) => void | Promise<void>) => Promise<boolean>;
}

const normalize = <T>(field: FormField<T>): FormFieldSpec<T> =>
	Array.isArray(field) ? { rules: field as readonly ValidationRule<T>[] } : (field as FormFieldSpec<T>);

const fieldError = <T>(spec: FormFieldSpec<T>, value: T): string | undefined => {
	for (const rule of spec.rules ?? []) {
		const message = testRule(rule, value);
		if (message !== undefined) return message;
	}
	return spec.validate?.(value);
};

/**
 * Multi-field form state — a `fields` map of `{ name: spec | rules[] }`
 * produces `values`, live `errors`, `touched` flags and a `submit` helper
 * that validates everything before invoking the handler.
 *
 * @param fields — `{ name: { initial, rules, validate } }` or `{ name: rules[] }`
 * @returns `{ values, errors, touched, set, blur, validate, validateAll, isValid, reset, submit }`
 *
 * @example
 * const form = useFormState({
 *   email: { initial: "", rules: [{ test: (v) => String(v).includes("@"), message: "invalid" }] },
 * });
 * <input onInput={(e) => form.set("email", e.currentTarget.value)} onBlur={() => form.blur("email")} />
 * <button onClick={() => form.submit((v) => api.save(v))} disabled={!form.isValid()}>Save</button>
 */
export function useFormState<TFields extends Record<string, FormField>>(fields: TFields): FormState<TFields> {
	const names = Object.keys(fields);
	const specs = new Map<string, FormFieldSpec>();
	for (const name of names) {
		const field = fields[name];
		if (field) specs.set(name, normalize(field));
	}

	const initialValues = () => {
		const out: FormValues = {};
		for (const name of names) out[name] = specs.get(name)?.initial ?? "";
		return out;
	};

	const [values, setValues] = createSignal<FormValues>(initialValues());
	const [touched, setTouched] = createSignal<FormTouched>({});

	const errors = createMemo<FormErrors>(() => {
		const current = values();
		const out: FormErrors = {};
		for (const name of names) {
			const spec = specs.get(name);
			if (spec) out[name] = fieldError(spec, current[name]);
		}
		return out;
	});

	const isValid = createMemo(() => names.every((name) => errors()[name] === undefined));

	const set = (name: keyof TFields & string, value: unknown) => {
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const blur = (name: keyof TFields & string) => {
		setTouched((prev) => ({ ...prev, [name]: true }));
	};

	const validate = (name: keyof TFields & string) => errors()[name] === undefined;

	const validateAll = () => {
		setTouched(Object.fromEntries(names.map((name) => [name, true])));
		return isValid();
	};

	const reset = () => {
		setValues(initialValues());
		setTouched({});
	};

	const submit = async (handler: (values: FormValues) => void | Promise<void>) => {
		if (!validateAll()) return false;
		await handler(values());
		return true;
	};

	return { values, errors, touched, set, blur, validate, validateAll, isValid, reset, submit };
}
