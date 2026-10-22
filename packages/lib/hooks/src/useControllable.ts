import { type Accessor, createSignal } from "solid-js";

export interface ControllableProps<T> {
	/** Controlled value — when defined, the hook follows it and never mutates internally. */
	value?: T;
	/** Initial value for uncontrolled mode. */
	defaultValue?: T;
	/** Fires on every requested change, controlled or not. */
	onChange?: (value: T) => void;
}

export interface ControllableControls<T> {
	/** Current value — `props.value` when controlled, internal state otherwise. */
	value: Accessor<T>;
	/** Request a change — updates internal state only when uncontrolled; always fires `onChange`. */
	set: (value: T | ((prev: T) => T)) => void;
	/** True while `props.value` is defined (controlled mode). */
	controlled: Accessor<boolean>;
}

/**
 * Controlled/uncontrolled pattern — pass `value` to control from the parent,
 * or `defaultValue` to let the hook manage state internally. `set` always
 * notifies `onChange`; it only writes internal state when uncontrolled.
 * Reads `props` lazily, so accessor-style props stay reactive.
 *
 * @param props — `{ value, defaultValue, onChange }`
 * @returns `{ value, set, controlled }`
 *
 * @example
 * const tabs = useControllable<string>({ defaultValue: "a", onChange: (v) => console.log(v) });
 * <button onClick={() => tabs.set("b")}>{tabs.value()}</button>
 */
export function useControllable<T>(props: ControllableProps<T>): ControllableControls<T> {
	const [inner, setInner] = createSignal<T>(props.defaultValue as T);
	const controlled = () => props.value !== undefined;
	const value = (() => (controlled() ? (props.value as T) : inner())) as Accessor<T>;
	const set = (v: T | ((prev: T) => T)) => {
		const next = typeof v === "function" ? (v as (prev: T) => T)(value()) : v;
		if (!controlled()) setInner(() => next);
		props.onChange?.(next);
	};
	return { value, set, controlled };
}
