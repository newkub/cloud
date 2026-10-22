/**
 * ThemeConfig - Theme configuration
 */

import type { Theme } from "../../types";

export interface ThemeConfig {
	readonly defaultTheme: Theme;
	readonly storageKey: string;
}

export const defaultThemeConfig: ThemeConfig = {
	defaultTheme: "system" as Theme,
	storageKey: "command-palette-theme",
};
