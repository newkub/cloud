export type SegmentGranularity = "grapheme" | "word" | "sentence";

export interface UseSegmenterOptions {
	/** @default "grapheme" */
	granularity?: SegmentGranularity;
}

export interface SegmenterControls {
	/** Whether Intl.Segmenter exists in this environment. */
	supported: boolean;
	/** Split `text` into segment strings. Falls back to code points. */
	segment: (text: string, granularity?: SegmentGranularity) => string[];
}

/**
 * `Intl.Segmenter` wrapper — locale-aware grapheme/word/sentence splitting.
 * Returns plain segment strings; falls back to `Array.from` (code points)
 * when Segmenter is unavailable.
 *
 * @param locale - BCP-47 tag. @default navigator.language ?? "en"
 * @param options - `{ granularity }` — may be overridden per call.
 * @returns `{ supported, segment }`
 *
 * @example
 * const seg = useSegmenter("en", { granularity: "word" });
 * seg.segment("hello world"); // ["hello", " ", "world"]
 */
export function useSegmenter(locale?: string, options?: UseSegmenterOptions): SegmenterControls {
	const lang = () => locale ?? (typeof navigator !== "undefined" ? navigator.language : "en");
	const supported = typeof Intl !== "undefined" && "Segmenter" in Intl;
	const segment = (text: string, granularity?: SegmentGranularity): string[] => {
		if (supported) {
			const seg = new Intl.Segmenter(lang(), { granularity: granularity ?? options?.granularity ?? "grapheme" });
			return [...seg.segment(text)].map((s) => s.segment);
		}
		return Array.from(text);
	};
	return { supported, segment };
}
