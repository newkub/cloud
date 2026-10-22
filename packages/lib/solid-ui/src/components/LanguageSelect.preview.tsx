/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { LanguageSelect } from "./LanguageSelect";

export const preview = (): JSX.Element => (
	<LanguageSelect
		class="w-64 max-w-full"
		defaultValue="th-TH"
		locales={[
			{ code: "en-US", name: "English (US)", flag: "🇺🇸" },
			{ code: "th-TH", name: "ไทย", flag: "🇹🇭" },
			{ code: "ja-JP", name: "日本語", flag: "🇯🇵" },
			{ code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
		]}
	/>
);
