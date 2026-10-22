import { createMemo } from "solid-js";

export type ListFormatOptions = Intl.ListFormatOptions | (() => Intl.ListFormatOptions);

/**
 * Memoized `Intl.ListFormat` — locale-aware list joining ("a, b, and c").
 * Pass an options accessor for reactive rebuilding.
 *
 * @param locale - BCP-47 tag. @default navigator.language ?? "en"
 * @param options - Intl.ListFormatOptions (type, style) or accessor.
 * @returns `{ format }` — `format(items)` joins with locale rules.
 *
 * @example
 * const lf = useListFormat("en", { type: "conjunction" });
 * lf.format(["a", "b", "c"]); // "a, b, and c"
 */
export function useListFormat(locale?: string, options?: ListFormatOptions) {
	const fmt = createMemo(() => {
		const opts = typeof options === "function" ? options() : options;
		return new Intl.ListFormat(locale ?? (typeof navigator !== "undefined" ? navigator.language : "en"), opts);
	});
	const format = (items: Iterable<string>) => fmt().format(items);
	return { format };
}
