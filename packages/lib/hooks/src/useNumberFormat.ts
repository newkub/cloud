import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface NumberFormatControls {
	/** Format `v` with the current `Intl.NumberFormat` instance */
	format: (v: number) => string;
	/** The resolved formatter itself */
	formatter: Accessor<Intl.NumberFormat>;
}

/**
 * Reactive `Intl.NumberFormat` — the formatter is memoised and rebuilt
 * only when `locale` or `options` (accessors accepted) change, so
 * `format(v)` is cheap to call inside JSX.
 *
 * @param locale — BCP-47 locale(s); defaults to the runtime locale
 * @param options — `Intl.NumberFormatOptions` or an accessor for them
 * @returns `{ format, formatter }`
 *
 * @example
 * const price = useNumberFormat("de-DE", { style: "currency", currency: "EUR" });
 * price.format(1234.5); // "1.234,50 €"
 */
export function useNumberFormat(
	locale?: MaybeAccessor<string | string[] | undefined>,
	options?: MaybeAccessor<Intl.NumberFormatOptions | undefined>,
): NumberFormatControls {
	const formatter = createMemo(() => new Intl.NumberFormat(read(locale), read(options)));
	return { format: (v) => formatter().format(v), formatter };
}
