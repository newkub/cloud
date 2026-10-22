export type ThemeMode = "light" | "dark";

export type ThemeColor =
	| "auto"
	| "slate"
	| "blue"
	| "indigo"
	| "violet"
	| "rose"
	| "pink"
	| "red"
	| "orange"
	| "amber"
	| "yellow"
	| "green"
	| "teal"
	| "cyan";

export type ThemeFont = "sans" | "serif" | "mono";
export type ThemeSpace = "compact" | "normal" | "spacious";
export type ThemeRadius = "none" | "small" | "medium" | "large";

export interface ThemeState {
	name: string;
	mode: ThemeMode;
	/** true = user picked a mode manually, so don't auto-switch on day/night. */
	modeLocked?: boolean;
	color: ThemeColor;
	font: ThemeFont;
	space: ThemeSpace;
	radius: ThemeRadius;
}

export interface ThemePreset {
	name: string;
	label: string;
	state: ThemeState;
}

export type ColorSet = {
	primary: string;
	primaryForeground: string;
	secondary: string;
	secondaryForeground: string;
	accent: string;
	accentForeground: string;
	ring: string;
	info: string;
	success: string;
	warning: string;
	destructive: string;
};

export interface ColorScheme {
	light: ColorSet;
	dark: ColorSet;
}
