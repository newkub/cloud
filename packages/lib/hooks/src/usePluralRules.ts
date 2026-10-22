import { createMemo } from "solid-js";

/**
 * Memoized `Intl.PluralRules` — locale-aware plural category selection.
 *
 * @param locale - BCP-47 tag. @default navigator.language ?? "en"
 * @param options - Intl.PluralRulesOptions.
 * @returns `{ select, selectRange }` — `select(1)` → "one", etc.
 *
 * @example
 * const pr = usePluralRules("en");
 * pr.select(1); // "one"  → `${count} ${pr.select(count) === "one" ? "item" : "items"}`
 */
export function usePluralRules(locale?: string, options?: Intl.PluralRulesOptions) {
	const rules = createMemo(
		() => new Intl.PluralRules(locale ?? (typeof navigator !== "undefined" ? navigator.language : "en"), options),
	);
	const select = (count: number) => rules().select(count);
	// `selectRange` is Intl proposal-era — not in every TS lib; fall back to select(end).
	const selectRange = (start: number, end: number) => {
		const r = rules() as Intl.PluralRules & {
			selectRange?: (start: number, end: number) => Intl.LDMLPluralRule;
		};
		return r.selectRange ? r.selectRange(start, end) : r.select(end);
	};
	return { select, selectRange };
}
