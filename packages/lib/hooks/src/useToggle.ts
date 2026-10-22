import { type Accessor, createSignal } from "solid-js";

export interface ToggleControls {
	/** Current value */
	on: Accessor<boolean>;
	/** Flip the value — use `set`/`setTrue`/`setFalse` to force it */
	toggle: () => void;
	/** Set explicitly */
	set: (value: boolean) => void;
	/** Set to true */
	setTrue: () => void;
	/** Set to false */
	setFalse: () => void;
	/** Pick a value by the flag — `valueOr("on", "off")` */
	valueOr: <A, B = A>(onValue: A, offValue?: B) => A | B | undefined;
}

/**
 * Boolean state with `toggle()` / `set()` helpers — `setTrue`/`setFalse`
 * shortcuts and `valueOr` to map the flag to arbitrary values.
 *
 * @param initial — Initial value. @default false
 * @param options — `onChange` fires after every actual change
 * @returns `{ on, toggle, set, setTrue, setFalse, valueOr }`
 *
 * @example
 * const { on, toggle, valueOr } = useToggle();
 * <button onClick={toggle}>{valueOr("on", "off")}</button>
 */
export function useToggle(
	initial = false,
	options?: {
		/** Called after every change. */
		onChange?: (value: boolean) => void;
	},
): ToggleControls {
	const [on, setOn] = createSignal(initial);
	const set = (value: boolean) => {
		const changed = value !== on();
		setOn(value);
		if (changed) options?.onChange?.(value);
	};
	return {
		on,
		toggle: () => set(!on()),
		set,
		setTrue: () => set(true),
		setFalse: () => set(false),
		valueOr: (onValue, offValue) => (on() ? onValue : offValue),
	};
}
