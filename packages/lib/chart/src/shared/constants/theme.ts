// Theme constants for chart library
// Clean Architecture: Shared kernel constants

export interface ChartTheme {
	primary: string;
	secondary: string;
	background: string;
	text: string;
	grid: string;
	tooltip: string;
	border: string;
}

export const DEFAULT_THEME: ChartTheme = {
	primary: "#3B82F6",
	secondary: "#10B981",
	background: "#FFFFFF",
	text: "#1F2937",
	grid: "#E5E7EB",
	tooltip: "rgba(0, 0, 0, 0.8)",
	border: "#D1D5DB",
};

export const DARK_THEME: ChartTheme = {
	primary: "#60A5FA",
	secondary: "#34D399",
	background: "#1F2937",
	text: "#F9FAFB",
	grid: "#374151",
	tooltip: "rgba(255, 255, 255, 0.9)",
	border: "#4B5563",
};

export const THEME_COLORS = [
	"#3B82F6",
	"#10B981",
	"#F59E0B",
	"#EF4444",
	"#8B5CF6",
	"#EC4899",
	"#06B6D4",
	"#84CC16",
] as const;

export type ThemeName = "light" | "dark" | "custom";

export const THEMES: Record<ThemeName, ChartTheme> = {
	light: DEFAULT_THEME,
	dark: DARK_THEME,
	custom: DEFAULT_THEME,
};
