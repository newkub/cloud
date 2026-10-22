import { type Accessor, createSignal } from "solid-js";

export type Messages = Record<string, string>;

export interface I18nOptions<L extends string> {
	/** Initial locale */
	locale: L;
	/** Locale used when a key is missing in the active one */
	fallback?: L;
	/** Message tables per locale */
	messages: Partial<Record<L, Messages>>;
}

export interface I18nControls<L extends string> {
	locale: Accessor<L>;
	setLocale: (l: L) => void;
	/** Translate `key`; interpolates `{var}` placeholders from `vars`. */
	t: (key: string, vars?: Record<string, string | number>) => string;
	/** All known locales */
	locales: () => L[];
	/** True when the key exists in the active or fallback locale */
	has: (key: string) => boolean;
}

/**
 * Dictionary-based i18n — reactive locale signal + `t()` lookup with
 * `{var}` interpolation and fallback-locale resolution.
 *
 * @example
 * const { t, setLocale } = useI18n({
 *   locale: "en",
 *   fallback: "en",
 *   messages: { en: { hi: "Hello {name}" }, th: { hi: "สวัสดี {name}" } },
 * });
 * t("hi", { name: "Ann" }) // "Hello Ann"
 */
export function useI18n<L extends string>(options: I18nOptions<L>): I18nControls<L> {
	const [locale, setLocale] = createSignal<L>(options.locale);

	const lookup = (key: string): string | undefined =>
		options.messages[locale()]?.[key] ?? (options.fallback ? options.messages[options.fallback]?.[key] : undefined);

	return {
		locale,
		setLocale,
		t: (key, vars) => {
			const raw = lookup(key);
			if (raw === undefined) return key;
			if (!vars) return raw;
			return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
		},
		locales: () => Object.keys(options.messages) as L[],
		has: (key) => lookup(key) !== undefined,
	};
}
