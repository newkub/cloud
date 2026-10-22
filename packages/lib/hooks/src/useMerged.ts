import { type Accessor, createMemo } from "solid-js";

/** Unwrapped value shape of a named accessor map. */
export type MergedValue<T extends Record<string, Accessor<unknown>>> = {
	[K in keyof T]: T[K] extends Accessor<infer V> ? V : never;
};

export interface MergedState<T extends Record<string, Accessor<unknown>>> {
	/** Combined object — a fresh `{ key: value }` memoized from every source. */
	value: Accessor<MergedValue<T>>;
}

/**
 * Combine named accessors into one reactive object — `value()` returns a
 * fresh `{ key: unwrappedValue }` whenever any source changes. Tracks all
 * sources; keys preserve their names and inferred types.
 *
 * @param sources — Map of `name → accessor` to combine
 * @returns `{ value }` — accessor for the merged object
 *
 * @example
 * const [first, setFirst] = createSignal("Ada");
 * const [last, setLast] = createSignal("Lovelace");
 * const person = useMerged({ first, last });
 * <p>{person.value().first} {person.value().last}</p>
 */
export function useMerged<T extends Record<string, Accessor<unknown>>>(sources: T): MergedState<T> {
	const value = createMemo(() => {
		const out = {} as MergedValue<T>;
		for (const key of Object.keys(sources) as (keyof T & string)[]) {
			const acc = sources[key];
			if (acc) out[key] = acc() as MergedValue<T>[keyof T & string];
		}
		return out;
	});
	return { value };
}
