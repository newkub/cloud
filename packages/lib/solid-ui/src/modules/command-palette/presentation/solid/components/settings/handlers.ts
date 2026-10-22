import type { CommandPaletteSettings } from "../../../../types";
import type { CommandPaletteSettingsProps } from "./types";
import { buildKeyboardShortcut } from "./utils";

type SettingsCallbackProps = Pick<
	CommandPaletteSettingsProps,
	"settings" | "onSettingsChange" | "onThemeChange" | "onShortcutChange"
>;

export function createSettingsHandlers(
	local: SettingsCallbackProps,
	setEditingShortcut: (value: string | null) => void,
) {
	const handleThemeChange = (themeId: string) => {
		local.onThemeChange?.(themeId);
	};

	const handleSettingChange = <K extends keyof CommandPaletteSettings>(key: K, value: CommandPaletteSettings[K]) => {
		local.onSettingsChange?.({
			...local.settings,
			[key]: value,
		});
	};

	const handleToggleHistory = (enabled: boolean) => handleSettingChange("enableHistory", enabled);
	const handleToggleAnimations = (enabled: boolean) => handleSettingChange("enableAnimations", enabled);
	const handleToggleAutoClose = (enabled: boolean) => handleSettingChange("autoClose", enabled);
	const handleMaxVisibleChange = (value: number) => handleSettingChange("maxVisibleCommands", value);
	const handleDebounceChange = (value: number) => handleSettingChange("debounceDelay", value);

	const handleShortcutEdit = (action: string) => {
		setEditingShortcut(action);
	};

	const handleShortcutKeyDown = (action: string, event: KeyboardEvent) => {
		event.preventDefault();
		local.onShortcutChange?.({
			...local.settings.keyboardShortcuts,
			[action]: buildKeyboardShortcut(event),
		});
		setEditingShortcut(null);
	};

	return {
		handleThemeChange,
		handleToggleHistory,
		handleToggleAnimations,
		handleToggleAutoClose,
		handleMaxVisibleChange,
		handleDebounceChange,
		handleShortcutEdit,
		handleShortcutKeyDown,
	};
}
