import { type Accessor, createMemo } from "solid-js";

/** Options for {@link useSorted}. */
export interface SortedOptions<T> {
	/** Accessor returning the property whose value items are sorted by. */
	by?: Accessor<keyof T>;
	/** Reverse the ordering. @default false */
	desc?: boolean;
}

const compareValues = (a: unknown, b: unknown) =>
	(a as string | number) < (b as string | number) ? -1 : (a as string | number) > (b as string | number) ? 1 : 0;

/**
 * Reactive sorted view of a list — returns an accessor yielding a new
 * sorted array whenever the list (or the `by` key) changes; the source
 * array is never mutated. Default ordering compares items (or the
 * `by()` property) with `<`; supply `compare` for full control.
 * `desc` flips whichever ordering is in effect.
 *
 * @param list — Accessor for the array to sort
 * @param compare — Custom comparator; wins over `by` when both are given
 * @param options — `by` picks a property key reactively, `desc` reverses
 * @returns Accessor for the sorted copy
 *
 * @example
 * const rows = useSorted(users, undefined, { by: () => "age", desc: true });
 * const ranked = useSorted(scores, (a, b) => b - a);
 */
export function useSorted<T>(
	list: Accessor<readonly T[]>,
	compare?: (a: T, b: T) => number,
	options?: SortedOptions<T>,
): Accessor<T[]> {
	const comparator = createMemo(() => {
		const dir = options?.desc ? -1 : 1;
		if (compare) return (a: T, b: T) => dir * compare(a, b);
		const key = options?.by?.();
		return (a: T, b: T) => dir * compareValues(key === undefined ? a : a[key], key === undefined ? b : b[key]);
	});
	return createMemo(() => [...list()].sort(comparator()));
}
