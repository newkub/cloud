import { createContext, createSignal, type JSX, useContext } from "solid-js";
import type { ChartTheme, ThemeName } from "../constants/theme";
import { DEFAULT_THEME, THEMES } from "../constants/theme";

interface ThemeContextValue {
	theme: ChartTheme;
	themeName: ThemeName;
	setTheme: (theme: ThemeName | ChartTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: DEFAULT_THEME,
	themeName: "light",
	setTheme: () => {},
});

export function useTheme() {
	return useContext(ThemeContext);
}

export function ThemeProvider(props: { children: JSX.Element; defaultTheme?: ThemeName }) {
	const [themeName, setThemeName] = createSignal<ThemeName>(props.defaultTheme ?? "light");
	const [customTheme, setCustomTheme] = createSignal<ChartTheme | undefined>();

	const setTheme = (theme: ThemeName | ChartTheme) => {
		if (typeof theme === "string") {
			setThemeName(theme);
			setCustomTheme(undefined);
		} else {
			setCustomTheme(theme);
			setThemeName("custom");
		}
	};

	const theme = () => {
		if (themeName() === "custom" && customTheme()) {
			return customTheme() ?? DEFAULT_THEME;
		}
		return THEMES[themeName()];
	};

	// Apply theme to CSS variables
	const applyTheme = (currentTheme: ChartTheme) => {
		const root = document.documentElement;
		root.style.setProperty("--chart-primary", currentTheme.primary);
		root.style.setProperty("--chart-secondary", currentTheme.secondary);
		root.style.setProperty("--chart-background", currentTheme.background);
		root.style.setProperty("--chart-text", currentTheme.text);
		root.style.setProperty("--chart-grid", currentTheme.grid);
		root.style.setProperty("--chart-tooltip", currentTheme.tooltip);
		root.style.setProperty("--chart-border", currentTheme.border);
	};

	// Apply theme on mount and when theme changes
	applyTheme(theme());

	return (
		<ThemeContext.Provider value={{ theme: theme(), themeName: themeName(), setTheme }}>
			{props.children}
		</ThemeContext.Provider>
	);
}
