import { For } from "solid-js";
import type { AppearanceSectionProps } from "./types";

export function AppearanceSection(props: AppearanceSectionProps) {
	return (
		<div class="settings-section">
			<h3 class="section-title">Appearance</h3>
			<div class="setting-item">
				<label for="theme-select" class="setting-label">
					Theme
				</label>
				<select
					id="theme-select"
					value={props.settings.theme}
					onChange={(e) => props.onThemeChange(e.currentTarget.value)}
					class="setting-select"
				>
					<For each={props.availableThemes()}>{(theme) => <option value={theme.id}>{theme.name}</option>}</For>
				</select>
			</div>
			<div class="setting-item">
				<label for="max-visible" class="setting-label">
					Max Visible Commands
				</label>
				<input
					id="max-visible"
					type="number"
					value={props.settings.maxVisibleCommands}
					onChange={(e) => props.onMaxVisibleChange(parseInt(e.currentTarget.value, 10))}
					class="setting-input"
					min="1"
					max="20"
				/>
			</div>
		</div>
	);
}
