import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface CollatorControls {
	/** Locale-aware comparator — usable directly as `Array.prototype.sort` argument */
	compare: (a: string, b: string) => number;
	/**
	 * Sort a copy of `list` with the collator. Pass `accessor` to sort
	 * objects by a derived string key — input order is never mutated.
	 */
	sort: <T>(list: readonly T[], accessor?: (item: T) => string) => T[];
}

/**
 * Memoized `Intl.Collator` — a stable `compare` function plus a `sort`
 * helper that clones the list before ordering. `locale` and `options`
 * may be accessors; the collator is rebuilt when they change.
 * SSR-safe: `Intl` is available on every runtime.
 *
 * @param locale — BCP-47 tag or accessor (`undefined` = runtime default)
 * @param options — `Intl.CollatorOptions` or accessor (e.g. `{ numeric: true }`)
 * @returns `{ compare, sort }`
 *
 * @example
 * const collator = useCollator(() => locale(), { numeric: true });
 * <For each={collator.sort(files(), (f) => f.name)}>{(f) => <Row f={f} />}</For>
 */
export function useCollator(
	locale?: MaybeAccessor<string | string[] | undefined>,
	options?: MaybeAccessor<Intl.CollatorOptions | undefined>,
): CollatorControls {
	const collator = createMemo(() => new Intl.Collator(read(locale ?? undefined), read(options ?? undefined)));

	return {
		compare: (a, b) => collator().compare(a, b),
		sort: (list, accessor) =>
			[...list].sort((a, b) =>
				collator().compare(accessor ? accessor(a) : String(a), accessor ? accessor(b) : String(b)),
			),
	};
}
