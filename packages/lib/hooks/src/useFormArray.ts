import { type Accessor, createSignal } from "solid-js";

export interface FormArrayControls<T> {
	/** Reactive snapshot of the field values */
	fields: Accessor<T[]>;
	/** Append values to the end */
	push: (...values: T[]) => void;
	/** Remove the value at `index` — returns it, or undefined when out of range */
	remove: (index: number) => T | undefined;
	/** Swap the values at `a` and `b` — no-op when either is out of range */
	swap: (a: number, b: number) => void;
	/** Move the value at `from` to `to` */
	move: (from: number, to: number) => void;
	/** Insert a value at `index` (clamped to `[0, length]`) */
	insert: (index: number, value: T) => void;
	/** Replace the value at `index` — accepts a value or an updater */
	update: (index: number, value: T | ((prev: T) => T)) => void;
	/** Replace the whole array */
	replace: (values: T[]) => void;
	/** Reactive field count */
	length: Accessor<number>;
}

/**
 * Dynamic field-array state — the array counterpart of `useForm` for repeatable
 * groups (phone numbers, line items). Every mutation returns a fresh array so
 * `fields()` and `length()` stay reactive.
 *
 * @param initial — Seed values. @default empty
 * @returns `{ fields, push, remove, swap, move, insert, update, replace, length }`
 *
 * @example
 * const phones = useFormArray([""]);
 * <For each={phones.fields()}>
 *   {(v, i) => (
 *     <input value={v} onInput={(e) => phones.update(i(), e.currentTarget.value)} />
 *   )}
 * </For>
 * <button onClick={() => phones.push("")}>add phone</button>
 */
export function useFormArray<T>(initial?: T[]): FormArrayControls<T> {
	const [fields, setFields] = createSignal<T[]>([...(initial ?? [])]);
	return {
		fields,
		push: (...values) => setFields((l) => [...l, ...values]),
		remove: (index) => {
			const l = fields();
			if (index < 0 || index >= l.length) return undefined;
			setFields([...l.slice(0, index), ...l.slice(index + 1)]);
			return l[index];
		},
		swap: (a, b) =>
			setFields((l) => {
				if (a < 0 || a >= l.length || b < 0 || b >= l.length) return l;
				const next = [...l];
				[next[a], next[b]] = [next[b] as T, next[a] as T];
				return next;
			}),
		move: (from, to) =>
			setFields((l) => {
				if (from < 0 || from >= l.length) return l;
				const i = Math.max(0, Math.min(to, l.length - 1));
				const next = [...l];
				const [value] = next.splice(from, 1);
				next.splice(i, 0, value as T);
				return next;
			}),
		insert: (index, value) =>
			setFields((l) => {
				const i = Math.max(0, Math.min(index, l.length));
				return [...l.slice(0, i), value, ...l.slice(i)];
			}),
		update: (index, value) =>
			setFields((l) =>
				index < 0 || index >= l.length
					? l
					: l.map((prev, i) =>
							i === index ? (typeof value === "function" ? (value as (p: T) => T)(prev) : value) : prev,
						),
			),
		replace: (values) => setFields([...values]),
		length: () => fields().length,
	};
}
