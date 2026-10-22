import { type Accessor, createMemo, createSignal } from "solid-js";

export interface FormControls<T extends Record<string, unknown>> {
	/** Reactive snapshot of the current values */
	values: Accessor<T>;
	/** `field → message` — re-derives live from `validate` as values change */
	errors: Accessor<Record<string, string>>;
	/** `field → touched` — set by `touchField`, all set by `handleSubmit` */
	touched: Accessor<Record<string, boolean>>;
	/** Update a single field */
	setField: <K extends keyof T & string>(field: K, value: T[K]) => void;
	/** Mark a field as touched */
	touchField: (field: keyof T & string) => void;
	/** Run the validator — stores nothing extra (errors are live); returns validity */
	validate: () => boolean;
	/** Restore `values` (or the initial values) and clear `touched` */
	reset: (values?: T) => void;
	/** True when `values` differ from the last reset baseline */
	isDirty: Accessor<boolean>;
	/** True when the validator reports no errors */
	isValid: Accessor<boolean>;
	/** `preventDefault`, touch all fields, and call `onSubmit` when valid */
	handleSubmit: (event?: { preventDefault?: () => void }) => Promise<void>;
}

/**
 * Lightweight form state — `values`/`touched` signals, live `errors` derived
 * from the `validate` option, `isDirty` tracked against the reset baseline.
 * Gate error display on `touched` so untouched fields stay quiet.
 *
 * @param initial — Initial field values
 * @param options — `validate(values)` returns `field → message`, `onSubmit` runs on valid submit
 * @returns `{ values, errors, touched, setField, touchField, validate, reset, isDirty, isValid, handleSubmit }`
 *
 * @example
 * const form = useForm({ email: "" }, {
 *   validate: (v) => (v.email.includes("@") ? {} : { email: "invalid email" }),
 *   onSubmit: (v) => console.log(v),
 * });
 * <form onSubmit={form.handleSubmit}>
 *   <input value={form.values().email} onInput={(e) => form.setField("email", e.currentTarget.value)}
 *     onBlur={() => form.touchField("email")} />
 *   <Show when={form.touched().email && form.errors().email}>{form.errors().email}</Show>
 * </form>
 */
export function useForm<T extends Record<string, unknown>>(
	initial: T,
	options?: {
		/** Return `field → message` for invalid fields — empty object means valid. */
		validate?: (values: T) => Record<string, string>;
		/** Called with the values when a submitted form is valid. */
		onSubmit?: (values: T) => void | Promise<void>;
	},
): FormControls<T> {
	const [values, setValues] = createSignal<T>({ ...initial });
	const [baseline, setBaseline] = createSignal<T>({ ...initial });
	const [touched, setTouched] = createSignal<Record<string, boolean>>({});

	const errors = createMemo(() => options?.validate?.(values()) ?? {});
	const isValid = createMemo(() => Object.keys(errors()).length === 0);
	const isDirty = createMemo(() => JSON.stringify(values()) !== JSON.stringify(baseline()));

	return {
		values,
		errors,
		touched,
		setField: (field, value) => setValues((v) => ({ ...v, [field]: value })),
		touchField: (field) => setTouched((t) => (t[field] ? t : { ...t, [field]: true })),
		validate: () => isValid(),
		reset: (next) => {
			const resolved = { ...(next ?? initial) } as T;
			setValues(() => resolved);
			setBaseline(() => resolved);
			setTouched({});
		},
		isDirty,
		isValid,
		handleSubmit: async (event) => {
			event?.preventDefault?.();
			setTouched(Object.fromEntries(Object.keys(values()).map((k) => [k, true])));
			if (!isValid()) return;
			await options?.onSubmit?.(values());
		},
	};
}
