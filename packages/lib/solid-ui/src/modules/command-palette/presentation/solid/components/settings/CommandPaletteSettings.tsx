/**
 * CommandPaletteSettings - SolidJS component for command palette settings
 */

import { createSignal, splitProps } from "solid-js";
import { AppearanceSection } from "./AppearanceSection";
import { BehaviorSection } from "./BehaviorSection";
import { createSettingsHandlers } from "./handlers";
import { ShortcutsSection } from "./ShortcutsSection";
import type { CommandPaletteSettingsProps } from "./types";

export function CommandPaletteSettingsComponent(props: CommandPaletteSettingsProps) {
	const [local] = splitProps(props, [
		"settings",
		"availableThemes",
		"onSettingsChange",
		"onThemeChange",
		"onShortcutChange",
	]);

	const [editingShortcut, setEditingShortcut] = createSignal<string | null>(null);
	const handlers = createSettingsHandlers(local, setEditingShortcut);

	return (
		<div class="command-palette-settings">
			<h2 class="settings-title">Command Palette Settings</h2>

			<AppearanceSection
				settings={local.settings}
				availableThemes={() => local.availableThemes}
				onThemeChange={handlers.handleThemeChange}
				onMaxVisibleChange={handlers.handleMaxVisibleChange}
			/>

			<BehaviorSection
				settings={local.settings}
				onToggleHistory={handlers.handleToggleHistory}
				onToggleAnimations={handlers.handleToggleAnimations}
				onToggleAutoClose={handlers.handleToggleAutoClose}
				onDebounceChange={handlers.handleDebounceChange}
			/>

			<ShortcutsSection
				shortcuts={local.settings.keyboardShortcuts}
				editingShortcut={editingShortcut}
				onEdit={handlers.handleShortcutEdit}
				onKeyDown={handlers.handleShortcutKeyDown}
			/>
		</div>
	);
}
