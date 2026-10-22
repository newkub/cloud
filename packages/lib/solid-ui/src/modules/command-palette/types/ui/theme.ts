/**
 * Theme Types
 */

export interface CommandPaletteTheme {
	readonly id: string;
	readonly name: string;
	readonly colors: {
		readonly background: string;
		readonly foreground: string;
		readonly accent: string;
		readonly border: string;
		readonly selection: string;
	};
	readonly fonts: {
		readonly family: string;
		readonly sizes: {
			readonly small: string;
			readonly medium: string;
			readonly large: string;
		};
	};
	readonly spacing: {
		readonly xs: string;
		readonly sm: string;
		readonly md: string;
		readonly lg: string;
		readonly xl: string;
	};
}

export interface CommandPaletteSettings {
	readonly theme: string;
	readonly keyboardShortcuts: Record<string, string>;
	readonly maxVisibleCommands: number;
	readonly debounceDelay: number;
	readonly enableHistory: boolean;
	readonly enableAnimations: boolean;
	readonly autoClose: boolean;
}
