import type { ThemeFont, ThemeRadius, ThemeSpace } from "./types";

export const fontStacks: Record<ThemeFont, string> = {
	sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
	serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
	mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

export const spaceScales: Record<ThemeSpace, Record<string, string>> = {
	compact: {
		"0": "0",
		"1": "0.125rem",
		"2": "0.25rem",
		"3": "0.375rem",
		"4": "0.5rem",
		"5": "0.625rem",
		"6": "0.75rem",
		"7": "0.875rem",
		"8": "1rem",
		"10": "1.25rem",
		"12": "1.5rem",
		"16": "2rem",
	},
	normal: {
		"0": "0",
		"1": "0.25rem",
		"2": "0.5rem",
		"3": "0.75rem",
		"4": "1rem",
		"5": "1.25rem",
		"6": "1.5rem",
		"7": "1.75rem",
		"8": "2rem",
		"10": "2.5rem",
		"12": "3rem",
		"16": "4rem",
	},
	spacious: {
		"0": "0",
		"1": "0.5rem",
		"2": "0.75rem",
		"3": "1rem",
		"4": "1.25rem",
		"5": "1.5rem",
		"6": "1.75rem",
		"7": "2rem",
		"8": "2.5rem",
		"10": "3rem",
		"12": "4rem",
		"16": "6rem",
	},
};

export const radiusScales: Record<ThemeRadius, { DEFAULT: string; sm: string; md: string; lg: string; xl: string }> = {
	none: { DEFAULT: "0", sm: "0", md: "0", lg: "0", xl: "0" },
	small: {
		DEFAULT: "0.25rem",
		sm: "0.125rem",
		md: "0.25rem",
		lg: "0.375rem",
		xl: "0.5rem",
	},
	medium: {
		DEFAULT: "0.5rem",
		sm: "0.25rem",
		md: "0.5rem",
		lg: "0.75rem",
		xl: "1rem",
	},
	large: {
		DEFAULT: "0.75rem",
		sm: "0.5rem",
		md: "0.75rem",
		lg: "1rem",
		xl: "1.5rem",
	},
};
