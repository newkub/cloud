import type { CommandPaletteSettings, CommandPaletteTheme } from "../../../../types";

export interface CommandPaletteSettingsProps {
	settings: CommandPaletteSettings;
	availableThemes: readonly CommandPaletteTheme[];
	onSettingsChange?: (settings: CommandPaletteSettings) => void;
	onThemeChange?: (themeId: string) => void;
	onShortcutChange?: (shortcuts: Record<string, string>) => void;
}

export interface AppearanceSectionProps {
	settings: CommandPaletteSettings;
	availableThemes: () => readonly CommandPaletteTheme[];
	onThemeChange: (themeId: string) => void;
	onMaxVisibleChange: (value: number) => void;
}

export interface BehaviorSectionProps {
	settings: CommandPaletteSettings;
	onToggleHistory: (enabled: boolean) => void;
	onToggleAnimations: (enabled: boolean) => void;
	onToggleAutoClose: (enabled: boolean) => void;
	onDebounceChange: (value: number) => void;
}

export interface ShortcutsSectionProps {
	shortcuts: Record<string, string>;
	editingShortcut: () => string | null;
	onEdit: (action: string) => void;
	onKeyDown: (action: string, event: KeyboardEvent) => void;
}
