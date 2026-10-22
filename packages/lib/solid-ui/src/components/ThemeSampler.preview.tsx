/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ThemeSampler } from "./ThemeSampler";

export const preview = (): JSX.Element => (
	<ThemeSampler
		themes={[
			{ name: "Slate", colors: { bg: "#f8fafc", fg: "#0f172a", primary: "#2563eb", accent: "#f59e0b" } },
			{ name: "Midnight", colors: { bg: "#0f172a", fg: "#e2e8f0", primary: "#38bdf8", accent: "#f472b6" } },
			{ name: "Forest", colors: { bg: "#f0fdf4", fg: "#14532d", primary: "#16a34a", accent: "#84cc16" } },
		]}
	/>
);
