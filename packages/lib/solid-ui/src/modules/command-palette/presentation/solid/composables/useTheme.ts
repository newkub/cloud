/**
 * useTheme - SolidJS composable for theme management
 */

import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { Theme } from "../../../types";
import { createTheme, isDarkTheme, isSystemTheme } from "../../../types";

const THEME_STORAGE_KEY = "command-palette-theme";

const getStoredTheme = (): Theme => {
	if (typeof window === "undefined") return createTheme("system");
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		return stored ? (JSON.parse(stored) as Theme) : createTheme("system");
	} catch {
		return createTheme("system");
	}
};

const setStoredTheme = (theme: Theme) => {
	try {
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
	} catch {
		// Ignore storage errors
	}
};

export function useTheme() {
	const [currentTheme, setCurrentTheme] = createSignal<Theme>(getStoredTheme());

	const isDark = createMemo(() => {
		const theme = currentTheme();
		if (isSystemTheme(theme)) {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return isDarkTheme(theme);
	});

	const setTheme = (theme: Theme) => {
		setCurrentTheme(theme);
		setStoredTheme(theme);
	};

	const toggleTheme = () => {
		const newTheme = isDarkTheme(currentTheme()) ? createTheme("light") : createTheme("dark");
		setTheme(newTheme);
	};

	const setLight = () => setTheme(createTheme("light"));
	const setDark = () => setTheme(createTheme("dark"));
	const setSystem = () => setTheme(createTheme("system"));

	const handleSystemThemeChange = () => {
		if (isSystemTheme(currentTheme())) {
			setTheme(createTheme("system"));
		}
	};

	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.addEventListener("change", handleSystemThemeChange);
	});

	onCleanup(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.removeEventListener("change", handleSystemThemeChange);
	});

	return {
		currentTheme,
		isDark,
		setTheme,
		toggleTheme,
		setLight,
		setDark,
		setSystem,
	};
}
